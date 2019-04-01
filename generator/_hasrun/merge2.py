import codecs
import json

import geojson
from shapely.geometry import shape, mapping
from shapely.ops import cascaded_union

def woof():
    areasGEOJSON = {"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:3857"}},"type":"FeatureCollection", "features":[]}

    with codecs.open('tomerge.geojson', encoding='utf8') as fh:
        ageojson = json.load(fh)

    geoms = []
    for feature in ageojson['features']:
        geoms.append(shape(feature['geometry']))

    boundary = cascaded_union([
        geom if geom.is_valid else geom.buffer(0) for geom in geoms
    ])

    js = geojson.Feature(geometry=boundary, properties={}, id='saintptburg')

    with codecs.open('rawr_XD.geojson', 'w', encoding='utf8') as fh:
       json.dump(js, fh)


if __name__ == "__main__":
    woof()