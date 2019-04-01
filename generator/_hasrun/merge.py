import codecs
import json
from pyproj import transform

from geolib import gps2merc


def convert_coords(feature):

    coords2 = []

    if feature['geometry']['type'] == 'Polygon':
        coords = [feature['geometry']['coordinates']]
    else:
        coords = feature['geometry']['coordinates']

    for poly in coords:
        polyarr = []
        for ring in poly:
            ringarr = []

            for coord in ring:
                coord2 = list(gps2merc(*coord))
                ringarr.append(coord2)

            polyarr.append(ringarr)
        coords2.append(polyarr)

    if feature['geometry']['type'] == 'Polygon':
        feature['geometry']['coordinates'] = coords2[0]
    else:
        feature['geometry']['coordinates'] = coords2


def woof():
    areasGEOJSON = {"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:3857"}},"type":"FeatureCollection", "features":[]}

    with codecs.open('europe.geojson', encoding='utf8') as fh:
        geojson_eu = json.load(fh)

    with codecs.open('russia.geojson', encoding='utf8') as fh:
        geojson_ru = json.load(fh)

    eu_keep = ['Belarus', 'Moldova', 'Ukraine']
    for feature in geojson_eu['features']:
        if feature['properties']['name'] not in eu_keep:
            continue

        convert_coords(feature)
        feature['id'] = feature['properties']['name']
        feature['properties'] = {
            'name': feature['properties']['name'],
            'iso': 'RU' if feature['properties']['name'] != 'Moldova' else 'RO'
        }
        areasGEOJSON['features'].append(feature)

    for feature in geojson_ru['features']:
        # if feature['properties']['name'] not in eu_keep:
        #     continue

        convert_coords(feature)
        feature['id'] = feature['properties']['name_latin'].replace(' Oblast', '')
        feature['properties'] = {
            'name': feature['properties']['name_latin'],
            'iso': 'RU' if feature['properties']['name'] != 'Moldova' else 'RO'
        }

        areasGEOJSON['features'].append(feature)

    print("Process finished")
    with codecs.open('rawr_XD.geojson', 'w', encoding='utf8') as fh:
       json.dump(areasGEOJSON, fh)

if __name__ == "__main__":
    woof()