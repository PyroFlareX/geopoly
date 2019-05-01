import os

from map_merge import map_merge
from map_separate import map_separate
from map_eastern import map_eastern


if __name__ == "__main__":
    if not os.path.isfile('geojson/NUTS_RG_01M_2016_3857_LEVL_1.geojson'):
        print("Separating maps...")
        map_separate()

    if not os.path.isfile('geojson/eastern_europe.geojson'):
        print("Generating Eastern Europe...")
        map_eastern(cache=True)

    print("Merging all maps together...")
    map_merge()
    os.replace('map_combined.geojson', 'GeoEditor/public/geojson/map_combined.geojson')

    print("Saved file to "+'GeoEditor/public/geojson/map_combined.geojson')
