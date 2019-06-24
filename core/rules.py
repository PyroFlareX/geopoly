import csv
from collections import defaultdict

import numpy as np

from core.entities import Area


def load_csv_as_dict(filename, mapping=None):
    items = {}
    id = mapping['__ID__']

    with open('core/content/{}.csv'.format(filename), 'r') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in spamreader:
            items[row[id]] = {k:(mapping[k](v) if v else None) for k,v in row.items() if k != id}

    return items


mapping = defaultdict(lambda: int)
mapping.update({
    '__ID__': 'type',

    'name': str,
    'special': str,
})

units_conf = load_csv_as_dict('units', mapping)




# todo: new way of wasting units in battle
# calculate defensive percentages
# total = sum((1/u['def']) for u in units.values())
# for u in units.values():
#     u['loss_freq'] = (1/u['def']) / total

def getMilPop(area: Area):
    n = 0
    for u in UNITS:
        n += getattr(area, u)

    return n

def getUnits(area: Area, area2: Area=None):
    if area2:
        for u in UNITS:
            yield u, units[u], getattr(area, u), getattr(area2, u)

    else:
        for u in UNITS:
            yield u, units[u], getattr(area, u)



def getAreaEP(area: Area):
    ep = 0

    for u, unit, num in getUnits(area):
        ep += num * getEffectivePoint(u)

    return ep


UNITS = [
    'HERO',
    'BARD',
    'FOOT',
    'PIKE',
    'LIGHTCAV',
    'KNIGHT'
    'ARCHER',
    'CATA',
    'BARBAR',
    'STRONG',
    'THUG',
    'DEFENDER',
]


def name2prof(u):
    prof = next(filter(lambda x: units_conf[x]['name'] == u, units_conf.keys()))

    return int(prof)


def getConf(prof):
    return units_conf[str(prof)]
