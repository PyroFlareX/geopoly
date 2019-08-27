import math

from engine.modules.turns.service import TurnBox
from game.entities import World, Country, Area
from game.instance import countries, areas, worlds
from game.util.load_gtml import load_gtml


def create_world_entities(world: World, orders=None):
    l_countries, l_areas, _ = load_gtml("game/maps/{}.gtml".format(world.map))

    world.max_players = len(l_countries)

    for area in l_areas:
        area.wid = world.wid
        area.iso2 = area.iso

    for i,country in enumerate(l_countries):
        country.wid = world.wid

        if orders is None:
            country.order = i
        else:
            country.order = orders.index(country.iso)

    # Number of cities in a map:
    # CEIL(N_MAX_PLAYERS * ((N_START_SHIELDS-1)/3))
    shields_avg = sum(c.shields for c in l_countries) / len(l_countries)
    city_count = sum(1 for el in filter(lambda a: a.tile == 'city', l_areas))
    max_city_count = math.ceil(world.max_players * (shields_avg+1)/3)

    if city_count > max_city_count:
        raise Exception("Max city count exceeded: {} / {}".format(city_count, max_city_count))

    return l_countries, l_areas


def start_world(world):
    l_countries, l_areas = create_world_entities(world)

    countries.save_all(l_countries)
    areas.save_all(l_areas)

    tb = TurnBox(world, map(lambda c: c.iso, sorted(l_countries, key=lambda c: c.order)))

    worlds.save(world)

