import json
from collections import defaultdict
from random import choice

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
        print("ERR, {} not in conn_graph".format(id1))

        return True

    return id2 in conn_graph[id1]


def get_neighbors(id1: str):
    return conn_graph[id1]



def is_guarded(area_to: Area):
    return None


def reset_map(match: Match, save=True):
    lareas = []

    for area in areas.get_all_with_units(match.mid):
        area.move_left = getMilPop(area)

        lareas.append(area)

    if save:
        areas.save_all(lareas)

def reset_areas(areas):
    for area in areas:
        area.move_left = getMilPop(area)


def normalize_patch(area: Area, patch: dict):
    new_patch = patch.copy()

    for u, unit, num in getUnits(area):
        new_patch[u] = min(patch[u], num)

    return new_patch
