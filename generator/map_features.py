import codecs
import json


def add_properties():
    """
    Adds any extra properties to the features
    """

    with codecs.open('../webapp/public/geojson/areas.geojson', encoding='utf8') as fh:
        areasGEOJSON = json.load(fh)

    with open('content/castles.json', 'r') as fh:
        castles = json.load(fh)


    for feature in areasGEOJSON['features']:
        iso = feature['properties']['iso']
        aid = feature['id']

        # assign properties
        if aid in castles['4']:
            feature['properties']['castle'] = 4
        elif aid in castles['3']:
            feature['properties']['castle'] = 3
        elif aid in castles['2']:
            feature['properties']['castle'] = 2
        elif aid in castles['1']:
            feature['properties']['castle'] = 1
        elif 'castle' in feature['properties']:
            del feature['properties']['castle']

    print("Saving files...")
    with codecs.open('../webapp/public/geojson/areas.geojson', 'w', encoding='utf8') as fh:
        json.dump(areasGEOJSON, fh)

    print("Added properties")

if __name__ == "__main__":
    add_properties()
