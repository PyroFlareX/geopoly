import codecs
import json
from queue import Queue
from collections import defaultdict

from core.instance import areas

with open('core/content/areas.geojson', 'r', encoding='utf8') as fh:
    l = json.load(fh)
    features = {feature['id']: feature for feature in l['features']}

    del l

conn_graph = defaultdict(set)
with open('core/content/conn.json') as fh:
    for id1, id2 in json.load(fh):
        conn_graph[id1].add(id2)
        conn_graph[id2].add(id1)

conn_graph = dict(conn_graph)

n_areas = areas.count()

def is_connected(id1: str, id2: str):
    if id1 not in conn_graph:
        # todo: temporal code, remove later
        print("ERR, {} not in conn_graph".format(id1))
        return False

    return id2 in conn_graph[id1]


def list_areas_player(pid, radius: int=None):
    lareas = areas.list_by_player(pid)

    if not radius:
        # radius = 0 -> we only discover the given player's areas
        return lareas

    nareas = discover_areas([area.id for area in lareas], radius=radius)

    return lareas + nareas


def discover_areas(area_ids, radius: int=None):
    discovered = set()

    for start_area_id in area_ids:
        if start_area_id not in discovered:

            dfs(start_area_id, discovered=discovered, depth=radius)
    return discovered


def dfs(start_area_id, depth, discovered=None):
    if discovered is None:
        discovered = set()

    discovered.add(start_area_id)

    if depth == 0:
        return

    for narea_id in conn_graph[start_area_id]:
        if narea_id not in discovered:

            dfs(narea_id, depth-1, discovered)

    return discovered


def load_areas_raw(area_ids):
    """ Loads geojson features based on area ids

    :param area_ids:
    """
    narea_ids = discover_areas(area_ids, radius=5)

    d_areas = areas.list(area_ids, as_dict=True)

    geojson = []
    for area_id in narea_ids:
        feature = features[area_id]

        feature['properties'] = feature['properties'].copy()
        feature['properties'].update(d_areas.get(area_id, {"virgin": True}))

        geojson.append(feature)

    return geojson
