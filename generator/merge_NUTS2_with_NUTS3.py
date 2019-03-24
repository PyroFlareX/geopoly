
import codecs
import json


def merge_nuts():
    # TODO this script will take two datasets (NUTS2 and NUTS3 regions of Europe) and merge them together

    #nuts2 = ('')
    nuts1 = ('NL', 'BE')
    nuts3 = {'HU', 'SK', 'AT', 'SI', 'RO', 'RS', 'HR', 'PL'}


    with codecs.open('public/geojson/NUTS_RG_10M_2016_3857_LEVL_3.geojson', encoding='utf8') as fh:
        geojson_nuts3 = json.load(fh)
    with codecs.open('public/geojson/NUTS_RG_10M_2016_3857_LEVL_2.geojson', encoding='utf8') as fh:
        geojson_nuts2 = json.load(fh)

    # TODO: ITT: change to WGS84!!!!!!!!!!!!!!!!!!!!!!!!!!!
    areasGEOJSON = {"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::3857"}},"features": []}


    for feature in geojson_nuts2['features']:
        # exclude countries that are in NUTS3 set
        if feature['properties']['CNTR_CODE'] not in nuts3:
            areasGEOJSON['features'].append(feature)
        else:
            print(feature['properties']['CNTR_CODE'])

    for feature in geojson_nuts3['features']:
        # include countries that are in NUTS3 set
        if feature['properties']['CNTR_CODE'] in nuts3:
            areasGEOJSON['features'].append(feature)


    with codecs.open('public/geojson/areas.geojson', 'w', encoding='utf8') as fh:
        json.dump(areasGEOJSON, fh)


if __name__ == "__main__":

    merge_nuts()
