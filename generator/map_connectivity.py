import codecs
import json

from shapely.geometry import shape

from geolib import create_geojson


def generate_connections():
    """
    Adds centroid and connectivity to geojson + creates connectivity graph
    then copies these files to their place
    """

    with codecs.open('../webapp/public/geojson/areas.geojson', encoding='utf8') as fh:
        areasGEOJSON = json.load(fh)

    with open('content/castles.json', 'r') as fh:
        castles = json.load(fh)

    with open('content/extra_conn.json') as fh:
        extra_conn = json.load(fh)

        connectivity = extra_conn['conn'] + extra_conn['conn_bridge']

    geoms = {}
    i = 0; L = len(areasGEOJSON['features']) **2; IC = round(L / 10)


    print("Adding centroids and connectivities...")

    for feature in areasGEOJSON['features']:
        iso = feature['properties']['iso']
        aid = feature['id']
        feature['properties']['conn'] = []

        if iso is None:
            print("  NONE ISO:", aid, iso)

        if aid not in geoms:
            geoms[aid] = shape(feature['geometry'])
        geom1 = geoms[aid]

        # calculate centroid
        if 'cen' not in feature['properties']:
            feature['properties']['cen'] = [round(geom1.centroid.x),round(geom1.centroid.y)]

        # assign properties
        if aid in castles['4']:
            feature['properties']['castle'] = 4
        elif aid in castles['3']:
            feature['properties']['castle'] = 3
        elif aid in castles['2']:
            feature['properties']['castle'] = 2
        elif aid in castles['1']:
            feature['properties']['castle'] = 1

        # add connectivity with neighboring areas
        for feature2 in areasGEOJSON['features']:
            if i % IC == 0:
                print("  {}%".format(round((i / L) * 100)), end="")
            i += 1

            iso2 = feature2['properties']['iso']
            aid2 = feature2['id']

            if aid == aid2:
                continue
            if aid2 in feature['properties']['conn']:
                continue
            #if iso2 != iso and iso in country_conn and iso2 not in country_conn[iso]:
            #    continue

            # check connectivity
            if aid2 not in geoms:
                geoms[aid2] = shape(feature2['geometry'])
            geom2 = geoms[aid2]

            try:
                if geom1.touches(geom2):
                    connectivity.append([aid, aid2])

                    feature['properties']['conn'].append(aid2)
                    #feature2['properties']['conn'].append(aid)
            except:
                print("  Skipped: {}/{} - {}/{}".format(aid, aid2, type(geom1), type(geom2)))
                pass

    print("Saving files...")
    with codecs.open('../webapp/public/geojson/areas.geojson', 'w', encoding='utf8') as fh:
        json.dump(areasGEOJSON, fh)

    with codecs.open('../core/content/conn.json', 'w', encoding='utf8') as fh:
        json.dump(connectivity, fh)

    # with codecs.open('../webapp/public/geojson/centroids.geojson', 'w', encoding='utf8') as fh:
    #     json.dump(centroidGEOJSON, fh)

    print("Map generated")


if __name__ == "__main__":
    generate_connections()
