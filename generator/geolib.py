from math import log, tan, pi, exp, atan

from shapely.geometry import Polygon, MultiPolygon, LineString


def gps2merc(lon, lat):
    x = lon * 20037508.34 / 180
    y = log(tan((90 + lat) * pi / 360)) / (pi / 180)
    y = y * 20037508.34 / 180

    return x,y


def merc2gps(x, y):
    lon = (x * 180) / 20037508.34
    lly = (y * 180) / 20037508.34
    lat = (atan(exp(lly * (pi / 180)))*360)/pi - 90

    return lon, lat


def create_geojson():
    return {"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG:3857"}},"type":"FeatureCollection", "features":[]}


def mapping(cont):
    geom = {'type': None, 'coordinates': []}

    if isinstance(cont, MultiPolygon):
        geom['type'] = 'MultiPolygon'
        for poly in cont:
            sub = []
            for i, point in enumerate(zip(poly.exterior.coords.xy[0], poly.exterior.coords.xy[1])):
                sub.append(point)
            geom['coordinates'].append([sub])
    elif isinstance(cont, Polygon):
        geom['type'] = 'Polygon'
        geom['coordinates'].append([])

        for i, point in enumerate(zip(cont.exterior.coords.xy[0], cont.exterior.coords.xy[1])):
            geom['coordinates'][0].append(point)

    return geom


def gps2merc_geom(geom):
    if geom['type'] == 'MultiPolygon':
        for p, poly in enumerate(geom['coordinates']):
            for r, ring in enumerate(poly):
                for i, coord in enumerate(ring):
                    ring[i] = gps2merc(*coord)

    elif geom['type'] == 'Polygon':
        poly = geom['coordinates']
        for r, ring in enumerate(poly):
            for i, coord in enumerate(ring):
                ring[i] = gps2merc(*coord)

