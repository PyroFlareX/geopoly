import codecs
import json
import os

from geolib import create_geojson

base_nuts = 3
exp_nuts = 2
exp_nuts2 = 1


#exceptions = ["FR", "TR", "ES", "IR", "EE", "LV", "LT"]
exceptions = ["UK", "GB", "NL", "BE", "DE", "CH"]
exceptions2 = []




def map_merge():
    newgeo = create_geojson()
    dir_temp = 'geojson/nuts{}'

    dir_base = dir_temp.format(base_nuts)
    dir_exp = dir_temp.format(exp_nuts)
    dir_exp2 = dir_temp.format(exp_nuts2)

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

        newgeo['features'].extend(reads['features'])


    # now add eastern europe
    with codecs.open('geojson/eastern/eastern_europe.geojson', 'r', encoding='utf8') as fh:
       eastern = json.load(fh)
       newgeo['features'].extend(eastern['features'])


    with codecs.open('map_combined.geojson', 'w', encoding='utf8') as fh:
        json.dump(newgeo, fh)


if __name__ == "__main__":
    map_merge()
