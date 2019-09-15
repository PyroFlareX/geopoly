import math
import random
from collections import defaultdict

from engine.modules.worlds import service
from engine.modules.turns.service import TurnBox

from game.entities import World, Country, Area, User
from game.instance import countries, areas, worlds, users
from game.util.load_gtml import load_gtml


def create_world_entities(world: World, AI=False):
    l_countries, l_areas, l_options = load_gtml("game/maps/{}.gtml".format(world.map))

    world.max_players = len(l_countries)

    country_pops = defaultdict(int)
    for area in l_areas:
        area.wid = world.wid
        area.iso2 = area.iso

        if area.unit:
            country_pops[area.iso] -= 1
        if area.build == 'barr':
            country_pops[area.iso] += 3
        elif area.build in ('cita','house'):
            country_pops[area.iso] += 1

    if 'initial_order' in l_options:
        if l_options['initial_order'] == 'random':
            # randomized order
            orders = list(range(len(l_countries)))
            random.shuffle(orders)
        else:
            # map-defined starting order
            orders = list(map(int, l_options['initial_order'].split(',')))
    else:
        # normal order 0,1,2...
        orders = list(range(len(l_countries)))

    for i, country in enumerate(l_countries):
        country.wid = world.wid
        country.ai = AI and i > 0
        country.pop = country_pops[country.iso]
        country.order = orders[i]

    # Number of cities in a map:
    # CEIL(N_MAX_PLAYERS * ((N_START_SHIELDS-1)/3))
    shields_avg = sum(c.shields for c in l_countries) / len(l_countries)
    city_count = sum(1 for el in filter(lambda a: a.tile == 'city', l_areas))
    max_city_count = math.ceil(world.max_players * (shields_avg+1)/3)

    if city_count > max_city_count:
        raise Exception("Max city count exceeded: {} / {}".format(city_count, max_city_count))

    return l_countries, l_areas


def start_world(world, AI=False):
    l_countries, l_areas = create_world_entities(world, AI=AI)

    # set first player as current
    tb = TurnBox(world, map(lambda c: c.iso, sorted(l_countries, key=lambda c: c.order)))
    tb.start()

    # save entities
    countries.save_all(l_countries)
    areas.save_all(l_areas)
    worlds.save(world)


def reset_world(world):

    areas.delete_all(world.wid)
    countries.delete_all(world.wid)

    start_world(world)


def create_world():
    default_map = 'map_hu'

    world = service.create(map=default_map)

    l_countries, _, _ = load_gtml("game/maps/{}.gtml".format(world.map), skip=('AREAS', 'TEST_CALLS'))

    return world, l_countries


def join_world(user: User, world: World, players, iso=None):
    l_countries, _, _ = load_gtml("game/maps/{}.gtml".format(world.map), skip=('AREAS', 'TEST_CALLS'))
    isos = [c.iso for c in l_countries]

    if user.wid and user.wid != world.wid:
        return False

    if world.rounds:
        # game has already started
        return False

    # attempt reconnect
    if user.iso:
        if user.wid == world.wid and user.iso in players:
            if players[user.iso]['username'] == user.username:
                # reconnect was successful
                return True

        # someone took our place or we had bad credentials in the first place
        user.wid = None
        user.iso = None
        users.set_world(user.uid, None, None)
        return False
    else:
        # otherwise, we are connecting

        if len(players) == world.max_players:
            return False

        if iso:
            # see if selected iso is valid
            if iso not in isos:
                return False

            if iso in players and players[iso]['username'] != user.username:
                return False

            user.iso = iso
        else:
            # find the first empty slot
            for iso in isos:
                if iso not in players:
                    user.iso = iso
                    break

        if not user.iso:
            # couldn't find an iso
            return False

        user.wid = world.wid
        users.set_world(user.uid, user.wid, user.iso)

        return True


def set_map(world, map_id):
    world.map = map_id

    worlds.save(world)