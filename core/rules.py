import csv
from collections import defaultdict

from core.entities import Area


def load_csv_as_dict(filename, mapping={}):
    items = {}

    with open('core/content/{}.csv'.format(filename), 'r') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in spamreader:
            items[row['name']] = {k:(mapping[k](v) if v else None) for k,v in row.items() if k != 'name'}

    return items


mapping = defaultdict(lambda : int)
mapping.update({
    'name': str,
    'cost': float,
    'attr_name': str,
    'attr_val': float,
})

units = load_csv_as_dict('units', mapping)

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

def getEffectivePoint(u):
    #  calculate effective points by averaging atts & def, and then measuring from the mean?
    sdown = 3.6

    unit = units[u]
    points = [unit['atk_i'], unit['atk_c'], unit['atk_a'], unit['def']]

    avg = sum(points) / len(points)
    mse = 0.5 * sum( (p-avg)**2 for p in points)

    if u == 'inf_skirmish':
        # special abilities
        ov = (1.83 * mse) / sdown
    elif u == 'inf_light':
        # ranking up
        ov = 0.055 * getEffectivePoint('inf_heavy')
    else:
        ov = 0

    return round(mse / sdown + ov)


def getAreaEP(area: Area):
    ep = 0

    for u, unit, num in getUnits(area):
        ep += num * getEffectivePoint(u)

    return ep


UNITS = list(units.keys())


def prof2int(prof):
    return units[prof]['type']

def int2prof(u):
    name = next(filter(lambda x: units[x]['type'] == u, units.keys()))
    return name
