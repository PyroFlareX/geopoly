from collections import defaultdict

from sqlalchemy import text
from sqlalchemy.ext.hybrid import hybrid_method

from core.entities import World, Area, Unit
from core.dal.ctx import get_session
from core.factories.units import create_unit
from core import rules
from core.instance import units


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

    # unit self-healing
    session.query(Unit)\
        .filter(Unit.health < 100)\
        .update({Unit.health: Unit.health + 1}, synchronize_session=False)

    # step training
    session.query(Area)\
        .filter(Area.train_left > 0, Area.training != None)\
        .update({Area.train_left: Area.train_left - 1}, synchronize_session=False)

    session.commit()


    # ------------------------------
    # !synchronized raw sql queries!
    # ------------------------------

    # reset moves per turn
    sql_move_maps = ""
    for unit in rules.units.values():
        sql_move_maps += "\n WHEN prof = {} THEN {}".format(unit['type'], unit['speed'])
    SQL = "UPDATE units SET move_left = CASE"+ sql_move_maps + "\nELSE 0\nEND"
    session.execute(text(SQL))


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
        unit_type = row['unit_type']
        iso = row['iso']
        pid = row['pid']

        prof = rules.int2prof(unit_type)

        unit = create_unit(prof, iso, wid=world_id, pid=pid, aid=area_id)
        lunits.append(unit)
    units.save_all(lunits)


    # reset trainings based on trainee unit mapping
    sql_train_maps = ""
    for unit in rules.units.values():
        if unit['train_turns'] != 0:
            sql_train_maps += "\n WHEN training = {} THEN {}".format(unit['type'], unit['train_turns'])
    SQL = "UPDATE areas SET train_left = CASE"+ sql_train_maps + "\nELSE 0\nEND WHERE train_left = 0"
    session.execute(text(SQL))

    session.commit()
