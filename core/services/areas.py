import codecs
import json
from queue import Queue
from collections import defaultdict

from core import rules
from core.entities import Area
from core.instance import areas

# with open('core/content/areas.geojson', 'r', encoding='utf8') as fh:
#     l = json.load(fh)
#     features = {feature['id']: feature for feature in l['features']}
#
#     del l

conn_graph = defaultdict(set)
with open('core/content/conn.json') as fh:
    for id1, id2 in json.load(fh):
        conn_graph[id1].add(id2)
        conn_graph[id2].add(id1)

conn_graph = dict(conn_graph)


def are_neighbors(id1: str, id2: str):
    if id1 not in conn_graph:
        # todo: temporal code, remove later
        print("ERR, {} not in conn_graph".format(id1))
        return False

    return id2 in conn_graph[id1]


def get_path(id1: str, id2: str, max_length: int=float('inf')):
    disc = set()

     # todo: itt: use an algorithm? :(


    print(1)


def list_areas_player(pid, radius: int=None):
    # todo @UNUSED
    lareas = areas.list_by_player(pid)

    if not radius:
        # radius = 0 -> we only discover the given player's areas
        return lareas

    nareas = _discover_areas([area.id for area in lareas], radius=radius)

    return lareas + nareas


def _discover_areas(area_ids, radius: int=None):
    discovered = set()

    for start_area_id in area_ids:
        if start_area_id not in discovered:

            _dfs(start_area_id, discovered=discovered, depth=radius)
    return discovered


def _dfs(start_area_id, depth=None, discovered=None):
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

    if depth > 0:
        for narea_id in conn_graph[start_area_id]:
            if narea_id not in discovered:
                _dfs(narea_id, depth-1, discovered)

    return discovered


def load_areas_raw(area_ids, wid, discover_fog=False):
    """ Loads geojson features based on area ids and world id

    :param area_ids: list of area ids or area id
    :param wid: world id
    :param discover_fog: whether or not to extend the search
    """
    if isinstance(area_ids, str):
        area_ids = [area_ids]

    if discover_fog:
        # extend search on area radius
        area_ids = _discover_areas(area_ids, radius=5)

    geojson = []

    # load from DB
    d_areas = areas.list(area_ids, wid, as_dict=True)

    # load from geojson file & merge
    for area_id in area_ids:
        feature = features[area_id]

        feature['properties'] = feature['properties'].copy()

        area = d_areas.get(area_id)
        if area:
            feature['properties'].update(area.toDict())

        geojson.append(feature)

    return geojson


def load_areas_all_raw(wid):
    geojson = []

    d_areas = areas.list_all(wid, as_dict=True)

    for id, feature in features.items():
        feature = feature.copy()
        feature['properties']['id'] = id

        if id in d_areas:
            area = d_areas[id]
            feature['properties'].update(area.toDict())

        geojson.append(feature)

    return geojson


def load_areas(area_ids, wid, discover_fog=False):
    """ Loads Area objects based on area ids and world id

    :param area_ids: list of area ids or area id
    :param wid: world id
    :param discover_fog: whether or not to extend the search
    """
    if isinstance(area_ids, str):
        area_ids = [area_ids]

    if discover_fog:
        # extend search on area radius
        area_ids = _discover_areas(area_ids, radius=5)

    lareas = []

    # load from DB
    d_areas = areas.list(area_ids, wid, as_dict=True)

    # load from geojson file & merge
    for area_id in area_ids:

        area = d_areas.get(area_id)
        if not area:
            area = Area(**features[area_id]['properties'])

        area.id = area_id
        area.wid = wid
        lareas.append(area)

    return lareas


def load_area(area_id, wid):
    area = areas.get(area_id, wid)

    if not area:
        area = Area(**features[area_id]['properties'])
    area.id = area_id
    area.wid = wid

    return area


def set_training(area_id, wid, prof):
    area = areas.get(area_id, wid)

    if prof is not None:
        area.train_left = rules.units[prof]['train_turns']
        area.training = prof
    else:
        area.train_left = None
        area.training = None

    return area


def is_connected(id1: str, id2: str):

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

