import json
from collections import defaultdict

from core import rules
from core.entities import Area
from core.instance import areas


# Area connection graph: for each area id it lists the connected areas
conn_graph = defaultdict(set)
with open('core/content/conn.json') as fh:
    for id1, id2 in json.load(fh):
        conn_graph[id1].add(id2)
        conn_graph[id2].add(id1)
conn_graph = dict(conn_graph)


def _discover_areas(area_ids, radius: int=None):
    discovered = set()

    for start_area_id in area_ids:
        if start_area_id not in discovered:

            _dfs(start_area_id, discovered=discovered, depth=radius)
    return discovered


def _dfs(start_area_id, depth=None, discovered=None, stop_at=None):
    """
    Recursive depth-first search with iterative limit

    :param start_area_id:
    :param depth:
    :param discovered:
    :return:
    """
    if discovered is None:
        discovered = set()

    discovered.add(start_area_id)

    if depth is None:
        depth = float('inf')

    if depth <= 0:
        return discovered

    if stop_at and stop_at in discovered:
        return discovered

    for narea_id in conn_graph[start_area_id]:
        if narea_id not in discovered:
            _dfs(narea_id, depth-1, discovered)

    return discovered


def set_training(area, wid, prof):
    conf = rules.getConf(prof)

    if prof is not None and conf['train_turns'] > 0:
        area.train_left = conf['train_turns']
        area.training = prof
    else:
        area.train_left = None
        area.training = None

    return area


def is_connected(id1: str, id2: str):
    disc = _dfs(id1, stop_at=id2)

    return id1 in disc and id2 in disc


def are_neighbors(id1: str, id2: str):

    if id1 not in conn_graph:
        # todo: temporal code, remove late
        print("ERR, {} not in conn_graph".format(id1))

        return True

    return id2 in conn_graph[id1]


def is_path_connected(path):
    idnow = path[0]

    for id1 in path[1:]:
        if id1 not in conn_graph[idnow]:
            return False
        idnow = id1

    return True


def get_neighbors(id1: str):
    return conn_graph[id1]


def get(area_id):
    return areas.get(area_id)