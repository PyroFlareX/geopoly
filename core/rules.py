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

def getUnits(area: Area):
    for u in UNITS:
        yield u, units[u], getattr(area, u)

def getEffectivePoint(u):
    unit = units[u]

    # todo: calculate effective points by averaging atts & def
    # todo: and then measuring from the mean?

    return 1


UNITS = [
    'inf_light', 'inf_home', 'inf_heavy', 'inf_skirmish',
    'cav_lancer', 'cav_hussar', 'cav_dragoon', 'cav_heavy',
    'art_light', 'art_heavy', 'art_mortar'
]