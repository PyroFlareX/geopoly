import json
from collections import defaultdict

from core.entities import Area, Match
from core.instance import areas
from core.rules import getUnits, getMilPop

conn_graph = defaultdict(set)
with open('core/content/conn.json') as fh:
    for id1, id2 in json.load(fh):
        conn_graph[id1].add(id2)
        conn_graph[id2].add(id1)

conn_graph = dict(conn_graph)


def is_connected(id1: str, id2: str):

    if id1 not in conn_graph:
        # todo: temporal code, remove late

        return True

    return id2 in conn_graph[id1]


def is_guarded(area_to: Area):
    return None


def reset_map(match: Match, save=True):
    lareas = []

    for area in areas.get_all_with_units_iter(match.mid):
        area.move_left = getMilPop(area)

        lareas.append(area)

    if save:
        areas.save_all(lareas)

def reset_areas(areas):
    for area in areas:
        area.move_left = getMilPop(area)
