

import json
import geojson
from shapely import wkb
from shapely.geometry import shape, Polygon, mapping
from shapely.ops import cascaded_union


with open('items.geojson') as fh:
    features = json.load(fh)

bbox = shape({
    'type': 'Polygon',
    'properties': {},
    'coordinates': [
        [
            [2186465, 5381655],
            [2186465, 5128007],
            [2452589, 5128007],
            [2452589, 5381655],
            [2186465, 5381655]
        ]
    ]
})

area = None

for feature in features['features']:
    geom = shape(feature['geometry'])

    if not area:
        area = geom
    else:
        area = area.union(geom)

area = bbox.difference(area)

# Save geojson


g2 = geojson.Feature(geometry=area, properties={})
with open('public/geojson/areas.geojson', 'w') as fh:
    json.dump(g2, fh)
