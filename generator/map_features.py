import codecs
import json
import os
from shutil import copyfile


def add_properties():
    """
    Adds any extra properties to the features
    """
    LOC = '../webapp/public/geojson/{}.geojson'

    # make backup file first
    copyfile(LOC.format('areas'), LOC.format('areas_tmp'))

    with codecs.open(LOC.format('areas'), encoding='utf8') as fh:
        areasGEOJSON = json.load(fh)

    with open('content/castles.json', 'r') as fh:
        castles = json.load(fh)

    with codecs.open('content/renames.json', encoding='utf8') as fh:
        renames = json.load(fh)


    for feature in areasGEOJSON['features']:
        iso = feature['properties']['iso']
        aid = feature['id']
        name = feature['properties']['name']

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

        # rename area
        if name in renames:
            feature['properties']['name'] = renames[name]
        elif aid in renames:
            feature['properties']['name'] = renames[aid]


    print("Saving files...")
    with codecs.open(LOC.format('areas'), 'w', encoding='utf8') as fh:
        json.dump(areasGEOJSON, fh)

    # now that we have safely overridden the file, remove the backup file
    os.remove(LOC.format('areas_tmp'))

    print("Added properties")

if __name__ == "__main__":
    add_properties()
