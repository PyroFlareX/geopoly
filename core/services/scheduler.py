from collections import defaultdict

from sqlalchemy import text, func
from sqlalchemy.ext.hybrid import hybrid_method

from core.entities import World, Area, Unit, Respawn
from core.dal.ctx import get_session
from core.factories.units import create_unit
from core import rules
from core.instance import units, respawns

# reset moves per turn
sql_move_maps = ""
for prof, unit in rules.units_conf.items():
    sql_move_maps += "\n WHEN prof = {} THEN {}".format(prof, unit['speed'])
SQL_RESET_MOVE_LEFT = "UPDATE units SET move_left = CASE" + sql_move_maps + "\nELSE 0\nEND"


def _simulate_unit_passive(session):
    # unit self-healing
    session.query(Unit)\
        .filter(Unit.health < 100)\
        .update({Unit.health: Unit.health + 1}, synchronize_session=False)

    # unit reset move exhausts
    session.execute(text(SQL_RESET_MOVE_LEFT))
    session.commit()


def _simulate_unit_training(session, world_id):
    # step training turns
    session.query(Area)\
        .filter(Area.train_left > 0, Area.training != None)\
        .update({Area.train_left: Area.train_left - 1}, synchronize_session=False)
    session.commit()

    # 1) collect castles and separate into full and non full
    # 2) update full castles, train to 1
    # 3) return castle ids that area ready to train units
    SQL = """
    WITH castles AS (SELECT a.id, count(*) >= 11 AS is_full, training as unit_type, a.pid, a.iso
      FROM areas a
      LEFT JOIN units u ON a.id = u.aid
      WHERE a.training IS NOT NULL AND a.train_left = 0 AND a.castle > 0
      GROUP BY a.id, a.training, a.pid, a.iso
    ),
    update_full AS (UPDATE areas
      SET train_left = 1
      FROM castles
      WHERE areas.id = castles.id AND castles.is_full)

    SELECT "id", "unit_type", "iso", "pid" FROM castles WHERE NOT is_full
    """
    result = session.execute(text(SQL))
    session.commit()

    # create new units at castles
    lunits = []

    for row in result:
        area_id = row['id']
        prof = row['unit_type']
        iso = row['iso']
        pid = row['pid']

        #prof = rules.int2prof(unit_type)

        unit = create_unit(prof, iso, wid=world_id, pid=pid, aid=area_id)
        lunits.append(unit)
    units.save_all(lunits)

    # reset trainings based on trainee unit mapping
    sql_train_maps = ""
    for prof, unit in rules.units_conf.items():
        if unit['train_turns'] != 0:
            sql_train_maps += "\n WHEN training = {} THEN {}".format(prof, unit['train_turns'])
    SQL = "UPDATE areas SET train_left = CASE" + sql_train_maps + "\nELSE 0\nEND WHERE train_left = 0"
    session.execute(text(SQL))
    session.commit()


def _simulate_aging(session):
    # units and nobles die of old age
    # 6% chance to die at each year, starting from year 45 (geometric distribution)
    SQL = """
    DELETE FROM units
    WHERE age > 45 AND random() > 0.94
    RETURNING id, name, age, iso, pid, aid
    """

    # session.query(Unit)\
    #     .filter(Unit.age > 45, func.random() > 0.94)\
    #     .returning(Unit.id, Unit.name, Unit.age, Unit.iso, Unit.pid, Unit.aid)\
    #     .delete({Area.train_left: Area.train_left - 1}, synchronize_session=False)
    #session.commit()

    result = session.execute(text(SQL)).fetchall()
    session.commit()

    lrespawns = []

    for dead in result:
        unit_id = dead['id']

        # dead['name'], dead['age']

        # todo: put it into events log + dead statistics (battle, age, etc)

        if dead['prof'] == 10:
            # schedule heroes to be respawned
            # todo: later: fetch capital area id from country
            area_id = None
            area_id = dead['aid']

            respawn = Respawn(aid=area_id, prof=10, train_left=2)
            lrespawns.append(respawn)

    respawns.save_all(lrespawns)


def _respawn_heroes(session):
    # step in respawn process
    session.query(Respawn)\
        .filter(Respawn.train_left > 0)\
        .update({Respawn.train_left: Respawn.train_left - 1}, synchronize_session=False)
    session.commit()

    # stop respawned heroes
    SQL = """
    DELETE FROM respawns
    WHERE train_left = 0
    RETURNING wid, aid, iso, prof
    """

    result = session.execute(text(SQL)).fetchall()
    session.commit()

    # create new heroes
    lunits = []
    for unit in result:
        unit = create_unit(10, unit['iso'], wid=unit['wid'], pid=unit['pid'], aid=unit['aid'])
        lunits.append(unit)
    units.save_all(lunits)



def run_batch_updates(world_id=None):
    """
    Simulates a turn in one DB session

    :param world_id: optional, world identifier for load balancing
    """
    # todo: world id filtering
    # filter(World.wid == world_id).\

    session = get_session()

    # update_increment_turns
    session.query(World)\
        .update({World.turns: World.turns + 1}, synchronize_session=False)
    session.commit()

    _simulate_unit_passive(session)

    _simulate_unit_training(session, world_id)

    _simulate_aging(session)


    _respawn_heroes(session)