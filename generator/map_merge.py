import codecs
import json
import os
from collections import defaultdict

from geolib import create_geojson

base_nuts = 3
exp_nuts = 2
exp_nuts2 = 1

#exceptions = ["FR", "TR", "ES", "IR", "EE", "LV", "LT"]
exceptions = ["UK", "GB", "NL", "BE", "DE", "CH"]
exceptions2 = []

maps = [
    ("PT", "ES"),
    ("IT",),
    ("FR","BE","NL","CH","DE"),
    ("DE",),
    ("AT","RO","RS","UA","DE","RU"),
    ("RO","RS","BG","EL","TR","ME","AT"),
    ("TR","IR"),
    ("RU",),
]

iso_mapping = {
    "AL": "TR", "CY": "TR",
    "CZ": "AT", "HU": "AT", "SI": "AT", "SK": "AT", "HR": "AT", "BA": "AT",

    "PL": "DE", "LU": "BE", "IS": "DK", "IE": "UK", "XK": "RS",
    "RU": "RU", "BY": "RU", "UA": "RU", "GE": "RU", "AZ": "RU", "AM": "RU", "EE": "RU", "FI": "RU","LI": "RU", "LV": "RU","LT": "RU",
    "MD": "RO", "IR": "IR", "IQ": "TR", "SY": "TR", "MK": "TR"
}


def add(mapsgeo, iso, reads):
    skipped = True
    for i, isos in enumerate(maps):
        iso = iso_mapping.get(iso, iso)

        if iso not in isos:
            continue
        skipped = False
        mapsgeo['map' + str(i)]['features'].extend(reads['features'])

    if skipped:
        print(iso + " not inserted in any map")


def map_merge():
    mapsgeo = defaultdict(create_geojson)
    dir_temp = 'geojson/nuts{}'

    dir_base = dir_temp.format(base_nuts)
    dir_exp = dir_temp.format(exp_nuts)
    dir_exp2 = dir_temp.format(exp_nuts2)
    dir_eastern = dir_temp.format('E')

    # Western Europe
    for fi in os.listdir(dir_base):
        iso = os.path.splitext(fi)[0]

        if iso in exceptions:
            filename = os.path.join(dir_exp, fi)
        elif iso in exceptions2:
            filename = os.path.join(dir_exp2, fi)
        else:
            filename = os.path.join(dir_base, fi)

        with codecs.open(filename, encoding='utf8') as fh:
            reads = json.load(fh)

        add(mapsgeo, iso, reads)

    # Eastern europe
    for fi in os.listdir(dir_eastern):
        iso = os.path.splitext(fi)[0]
        filename = os.path.join(dir_eastern, fi)

        with codecs.open(filename, encoding='utf8') as fh:
            reads = json.load(fh)

        add(mapsgeo, iso, reads)

    target = 'GeoEditor/public/geojson/{}.geojson'

    # save all maps
    for map_id, geojson in mapsgeo.items():
        with codecs.open(target.format(map_id), 'w', encoding='utf8') as fh:
            json.dump(geojson, fh)


if __name__ == "__main__":
    map_merge()
