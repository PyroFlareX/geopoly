import csv

from core.entities import Area


def load_csv_as_dict(filename):
    items = {}

    with open('core/content/{}.csv'.format(filename), 'r') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in spamreader:
            items[row['name']] = {k:(int(v) if v else None) for k,v in row.items() if k != 'name'}

    return items

units = load_csv_as_dict('units')

# calculate defensive percentages
total = sum((1/u['def']) for u in units.values())
for u in units.values():
    u['loss_freq'] = (1/u['def']) / total

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


UNITS = [
    'inf_light', 'inf_home', 'inf_heavy', 'inf_skirmish',
    'cav_lancer', 'cav_hussar', 'cav_dragoon', 'cav_heavy',
    'art_light', 'art_heavy', 'art_mortar'
]