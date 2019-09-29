import enum
import json

from engine.modules.geomap import service

current_turn = 0

countries_cache = {}
areas_cache = {}

with open('game/content/ai_scores.json') as fh:
    scores = json.load(fh)


class Dec(enum.Enum):
    buy = 1
    move = 2
    shield = 3


def find_neighbors(area, gamemap, filt, depth=2):
    # finds neighbors in a 2x2 area
    discovered_en = set()

    for narea_id in gamemap[area.id]:
        narea = gamemap[narea_id]

        if narea_id not in discovered_en and filt(area, narea, 1):
            yield narea
            discovered_en.add(narea_id)

        if depth < 2:
            continue

        for narea_id2 in gamemap[narea_id]:
            narea2 = gamemap[narea_id2]

            if narea_id2 not in discovered_en and filt(area, narea2, 2):
                yield narea2
                discovered_en.add(narea_id2)


def can_move_func(area, narea, n_away):
    if n_away == 2:
        # units far away can only be attacked
        return bool(narea.unit) and area.unit != 'inf'


    return narea.iso != area.iso or not bool(narea.unit)



def ai_act(world, iso):
    # todo: later: load cache

    countries = {c.iso: c for c in world.countries}
    areas = {a.id: a for a in world.areas}
    gamemap = service.switch_conn_graph(world.map)

    country = next(filter(lambda c: c.iso == iso, countries))


    # todo: + add tribute as possibility

    # tuples of action,area1,area2,score
    possible_moves = []

    my_units = set()
    my_cities = set()
    my_empty_tiles = set()
    enemy_units = set()
    enemy_cities = set()

    # step 1. discover entities
    for area in areas:
        if area.iso == iso:
            if area.unit:
                my_units.add(area)

            if area.tile == 'city':
                my_cities.add(area)
            elif not area.tile:
                my_empty_tiles.add(area)

        else:
            if area.unit:
                enemy_units.add(area)

            if area.tile == 'city':
                enemy_cities.add(area)

    # step 2. discover moves that my units can make
    for unit in my_units:
        pass
        # todo: calculate reward for this move

        # todo: calculate punishments for this move

    # step 3. discover buys i can make
    for area in my_cities:
        pass

        # todo: calculate reward for this buy

        # todo: calculate punishments for this buy

    # step 4. discover city-buys i can make
    for area in my_empty_tiles:
        pass

        # todo: calculate reward for this city buy

        # todo: calculate punishments for this city buy


#for narea in find_neighbors(area, gamemap, can_move_func, depth=area.unit!='inf'):

# todo: move to mount
# todo: move to river
# todo: move to forest
# todo: move to empty
# todo: move to enemy

# todo: kill inf
# todo: kill cav
# todo: kill art

# todo: capt barr
# todo: capt cita
# todo: capt city
# todo: capt house
# todo: capt area

# todo: buy inf
# todo: buy house
# todo: buy cav
# todo: buy barr
# todo: buy art
# todo: buy cita
# todo: buy city



