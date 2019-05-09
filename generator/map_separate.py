import codecs
import json
import os
import zipfile
from collections import defaultdict

from shapely.geometry import shape, mapping

from geolib import create_geojson


def convert_properties(feature):
    prop = feature['properties'].copy()
    geom = shape(feature['geometry'])

    feature['properties'] = {
        "iso": prop['CNTR_CODE'],
        "name": prop['NUTS_NAME'],
        "cen": [geom.centroid.x,geom.centroid.y]
    }


def map_separate():
    # extract file
    zip_ref = zipfile.ZipFile("gis_eu_nuts.zip", 'r')
    zip_ref.extract("NUTS_RG_01M_2016_3857_LEVL_0.geojson", 'geojson')
    zip_ref.extract("NUTS_RG_01M_2016_3857_LEVL_1.geojson", 'geojson')
    zip_ref.extract("NUTS_RG_01M_2016_3857_LEVL_2.geojson", 'geojson')
    zip_ref.extract("NUTS_RG_01M_2016_3857_LEVL_3.geojson", 'geojson')
    zip_ref.close()

    for N in range(0, 4):
        with codecs.open('geojson/NUTS_RG_01M_2016_3857_LEVL_{}.geojson'.format(N), encoding='utf8') as fh:
            NUTS1 = json.load(fh)

        nuts1 = defaultdict(create_geojson)

        for feature in NUTS1['features']:
            convert_properties(feature)
            nuts1[feature['properties']['iso']]['features'].append(feature)

        if not os.path.exists('geojson/nuts{}'.format(N)):
            os.mkdir('geojson/nuts{}'.format(N))

        for iso, geojson in nuts1.items():
            with codecs.open('geojson/nuts{}/{}.json'.format(N,iso), 'w', encoding='utf8') as fh:
                json.dump(geojson, fh)

if __name__ == "__main__":
    map_separate()
