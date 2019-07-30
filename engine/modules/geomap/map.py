import json
import os
from collections import defaultdict

from engine import settings

_multiple_maps = settings.get('geomap.multiple_maps', True)
_map_loc = settings.get('geomap.mapfile', 'game/content/')

_maps = {}
conn_graph = None


def load_conn_graph(map_name):
    if map_name not in _maps:
        filename = _map_loc.format(map_name) if _multiple_maps else _map_loc

        _loaded_graph = defaultdict(set)
        with open(filename) as fh:
            for id1, id2 in json.load(fh):
                _loaded_graph[id1].add(id2)
                _loaded_graph[id2].add(id1)
        _maps[map_name] = dict(_loaded_graph)

        if not _multiple_maps:
            switch_conn_graph(map_name)


def switch_conn_graph(map_name):
    global conn_graph

    if map_name not in _maps:
        load_conn_graph(map_name)

    conn_graph = _maps[map_name]


if not _multiple_maps:
    # load the default map (filename defined in config)
    load_conn_graph('default')
elif settings.get('geomap.preload'):
    # preload all maps
    for filename in os.listdir(os.path.dirname(_map_loc)):
        bname, ext = os.path.splitext(filename)
        load_conn_graph(bname)


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
