import sys
from unittest.mock import MagicMock

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from cliapp.commands.MigrateCommand import MigrateCommand
from game.ctx import config, set_session
from game.instance import worlds, countries, areas, users
from game.entities import World, User
from engine.modules.geomap import service
from testapp.util.load_gtml import load_gtml
from testapp.webmock import mock_ws

WID = '00000000-0000-1000-a000-000000000000'

def _fake_db():
    cf = config['postgres']
    cf['database'] = 'geopoly_test'

    db_engine = create_engine('{type}+psycopg2://{user}:{password}@{host}/{database}'.format(**cf))
    set_session(sessionmaker(bind=db_engine))


def _migrate_and_reset():
    try:
        # delete
        _delete_all()
    except Exception as e:
        mc = MigrateCommand(MagicMock())
        mc.run()


def _delete_all():
    w = worlds.get(WID)

    if w is not None:
        worlds.delete(w)
        areas.delete_all(WID)
        countries.delete_all(WID)
        users.delete_all()


def _set_up_gtml(filename):
    adict, l_countries = load_gtml(filename)

    return _set_up_game(adict, l_countries)


def _set_up_game(l_countries, adict):
    #_fake_db()
    _migrate_and_reset()


    world = World(current='P1', wid=WID)
    l_users = []

    i = 1
    for country in l_countries:
        country.name = 'Country '+country.iso
        country.wid = world.wid
        country.order = i

        l_users.append(User(iso=country.iso, email='c1@c.com', password='p', token='t', salt='s', username='Person '+country.iso, wid=world.wid, elo=1100, division=1))
        i += 1

    conn_graph = {}
    l_areas = {}

    cid = lambda x, y: 'a{}{}'.format(x, y)

    for y in range(0, 4):
        for x in range(0, 4):
            area = adict[x][y]
            area.id = cid(x, y)
            area.wid = world.wid

            if area.build in ('barr','house','cita'):
                area.tile = 'city'

            l_areas[area.id] = area
            conn_graph[area.id] = [
                cid(x - 1, y),
                cid(x + 1, y),
                cid(x, y - 1),
                cid(x, y + 1),
            ]

    service.switch_conn_graph(conn_graph)

    worlds.save(world)
    countries.save_all(l_countries)
    areas.save_all(l_areas.values())
    users.save_all(l_users)

    # reset country pop field
    countries.set_pop(WID)

    return world, l_users, l_countries, l_areas


def _finish():
    _delete_all()


def _execute(calls, resp_format='list'):

    _calls = []
    _returns = []
    _expects = []


    for call, expects in calls:
        if call == 'STOP_TEST':
            _calls.append((call, None))
            _returns.append(None)
            _expects.append(None)
            break

        route, params, u_iso = call
        user = _get_user(u_iso)

        resp = mock_ws(route, params, user, resp_format=resp_format)

        _calls.append((route, params))
        _returns.append(resp)
        _expects.append(expects)

    return _calls, _returns, _expects


def _get_user(iso):
    return users.session.query(User)\
        .filter(User.iso == iso, User.wid == WID)\
    .first()
