import codecs
import json

from shapely.geometry import shape


def generate():
    """
    Adds centroid and connectivity to geojson + creates connectivity graph
    then copies these files to their place
    """

    with codecs.open('GeoEditor/public/geojson/areas.geojson', encoding='utf8') as fh:
        areasGEOJSON = json.load(fh)

    with open('country_conn.json') as fh:
        country_conn = json.load(fh)

    with open('extra_conn.json') as fh:
        extra_conn = json.load(fh)

    connectivity = extra_conn
    geoms = {}

    for feature in areasGEOJSON['features']:
        # calculate centroid
        iso = feature['properties']['iso']
        aid = feature['id']
        feature['properties']['conn'] = []

        if iso is None:
            print(aid, iso)

        if aid not in geoms:
            geoms[aid] = shape(feature['geometry'])
        geom1 = geoms[aid]

        # get centroid
        feature['properties']['cen'] = [round(geom1.centroid.x),round(geom1.centroid.y)]

        for feature2 in areasGEOJSON['features']:
            iso2 = feature2['properties']['iso']
            aid2 = feature2['id']

            if aid == aid2:
                continue
            if aid2 in feature['properties']['conn']:
                continue
            if iso2 != iso and iso2 not in country_conn[iso]:
                continue

            if aid2 not in geoms:
                geoms[aid2] = shape(feature2['geometry'])
            geom2 = geoms[aid2]

            if geom1.touches(geom2):
                connectivity.append([aid, aid2])

                feature['properties']['conn'].append(aid2)
                #feature2['properties']['conn'].append(aid)

    with codecs.open('../webapp/public/geojson/areas.geojson', 'w', encoding='utf8') as fh:
        json.dump(areasGEOJSON, fh, separators=(',', ':'))

    with codecs.open('../core/content/conn.json', 'w', encoding='utf8') as fh:
        json.dump(connectivity, fh)

    print("Map generated")

if __name__ == "__main__":
    generate()
