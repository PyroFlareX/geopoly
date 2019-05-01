import codecs
import csv
import json
import math
import os
import pickle
import random
import sys
from collections import defaultdict
from functools import cmp_to_key
from itertools import product

from eme import entities
from eme.entities import EntityJSONEncoder
from shapely.geometry import Polygon, shape, mapping, LineString, Point, MultiLineString, MultiPoint

import geolib
from voronoi import voronoi
from geolib import gps2merc



eastern = {
    "RU": "RU", "BY": "RU", "UA": "RU", "MD": "RO", "GE": "RU", "AZ": "RU", "AM": "RU", "IR": "IR", "IQ": "TR", "SY": "TR",
    "XK": "XK", "BA": "AT",
}
exclude_worldmap = ['XK', 'BA']


countryISOMapping = {  "AFG": "AF",  "ALA": "AX",  "ALB": "AL",  "DZA": "DZ",  "ASM": "AS",  "AND": "AD",  "AGO": "AO",  "AIA": "AI",  "ATA": "AQ",  "ATG": "AG",  "ARG": "AR",  "ARM": "AM",  "ABW": "AW",  "AUS": "AU",  "AUT": "AT",  "AZE": "AZ",  "BHS": "BS",  "BHR": "BH",  "BGD": "BD",  "BRB": "BB",  "BLR": "BY",  "BEL": "BE",  "BLZ": "BZ",  "BEN": "BJ",  "BMU": "BM",  "BTN": "BT",  "BOL": "BO",  "BIH": "BA",  "BWA": "BW",  "BVT": "BV",  "BRA": "BR",  "VGB": "VG",  "IOT": "IO",  "BRN": "BN",  "BGR": "BG",  "BFA": "BF",  "BDI": "BI",  "KHM": "KH",  "CMR": "CM",  "CAN": "CA",  "CPV": "CV",  "CYM": "KY",  "CAF": "CF",  "TCD": "TD",  "CHL": "CL",  "CHN": "CN",  "HKG": "HK",  "MAC": "MO",  "CXR": "CX",  "CCK": "CC",  "COL": "CO",  "COM": "KM",  "COG": "CG",  "COD": "CD",  "COK": "CK",  "CRI": "CR",  "CIV": "CI",  "HRV": "HR",  "CUB": "CU",  "CYP": "CY",  "CZE": "CZ",  "DNK": "DK",  "DJI": "DJ",  "DMA": "DM",  "DOM": "DO",  "ECU": "EC",  "EGY": "EG",  "SLV": "SV",  "GNQ": "GQ",  "ERI": "ER",  "EST": "EE",  "ETH": "ET",  "FLK": "FK",  "FRO": "FO",  "FJI": "FJ",  "FIN": "FI",  "FRA": "FR",  "GUF": "GF",  "PYF": "PF",  "ATF": "TF",  "GAB": "GA",  "GMB": "GM",  "GEO": "GE",  "DEU": "DE",  "GHA": "GH",  "GIB": "GI",  "GRC": "GR",  "GRL": "GL",  "GRD": "GD",  "GLP": "GP",  "GUM": "GU",  "GTM": "GT",  "GGY": "GG",  "GIN": "GN",  "GNB": "GW",  "GUY": "GY",  "HTI": "HT",  "HMD": "HM",  "VAT": "VA",  "HND": "HN",  "HUN": "HU",  "ISL": "IS",  "IND": "IN",  "IDN": "ID",  "IRN": "IR",  "IRQ": "IQ",  "IRL": "IE",  "IMN": "IM",  "ISR": "IL",  "ITA": "IT",  "JAM": "JM",  "JPN": "JP",  "JEY": "JE",  "JOR": "JO",  "KAZ": "KZ",  "KEN": "KE",  "KIR": "KI",  "PRK": "KP",  "KOR": "KR",  "KWT": "KW",  "KGZ": "KG",  "LAO": "LA",  "LVA": "LV",  "LBN": "LB",  "LSO": "LS",  "LBR": "LR",  "LBY": "LY",  "LIE": "LI",  "LTU": "LT",  "LUX": "LU",  "MKD": "MK",  "MDG": "MG",  "MWI": "MW",  "MYS": "MY",  "MDV": "MV",  "MLI": "ML",  "MLT": "MT",  "MHL": "MH",  "MTQ": "MQ",  "MRT": "MR",  "MUS": "MU",  "MYT": "YT",  "MEX": "MX",  "FSM": "FM",  "MDA": "MD",  "MCO": "MC",  "MNG": "MN",  "MNE": "ME",  "MSR": "MS",  "MAR": "MA",  "MOZ": "MZ",  "MMR": "MM",  "NAM": "NA",  "NRU": "NR",  "NPL": "NP",  "NLD": "NL",  "ANT": "AN",  "NCL": "NC",  "NZL": "NZ",  "NIC": "NI",  "NER": "NE",  "NGA": "NG",  "NIU": "NU",  "NFK": "NF",  "MNP": "MP",  "NOR": "NO",  "OMN": "OM",  "PAK": "PK",  "PLW": "PW",  "PSE": "PS",  "PAN": "PA",  "PNG": "PG",  "PRY": "PY",  "PER": "PE",  "PHL": "PH",  "PCN": "PN",  "POL": "PL",  "PRT": "PT",  "PRI": "PR",  "QAT": "QA",  "REU": "RE",  "ROU": "RO",  "RUS": "RU",  "RWA": "RW",  "BLM": "BL",  "SHN": "SH",  "KNA": "KN",  "LCA": "LC",  "MAF": "MF",  "SPM": "PM",  "VCT": "VC",  "WSM": "WS",  "SMR": "SM",  "STP": "ST",  "SAU": "SA",  "SEN": "SN",  "SRB": "RS",  "SYC": "SC",  "SLE": "SL",  "SGP": "SG",  "SVK": "SK",  "SVN": "SI",  "SLB": "SB",  "SOM": "SO",  "ZAF": "ZA",  "SGS": "GS",  "SSD": "SS",  "ESP": "ES",  "LKA": "LK",  "SDN": "SD",  "SUR": "SR",  "SJM": "SJ",  "SWZ": "SZ",  "SWE": "SE",  "CHE": "CH",  "SYR": "SY",  "TWN": "TW",  "TJK": "TJ",  "TZA": "TZ",  "THA": "TH",  "TLS": "TL",  "TGO": "TG",  "TKL": "TK",  "TON": "TO",  "TTO": "TT",  "TUN": "TN",  "TUR": "TR",  "TKM": "TM",  "TCA": "TC",  "TUV": "TV",  "UGA": "UG",  "UKR": "UA",  "ARE": "AE",  "GBR": "GB",  "USA": "US",  "UMI": "UM",  "URY": "UY",  "UZB": "UZ",  "VUT": "VU",  "VEN": "VE",  "VNM": "VN",  "VIR": "VI",  "WLF": "WF",  "ESH": "EH",  "YEM": "YE",  "ZMB": "ZM",  "ZWE": "ZW",
                       "XKS": "XK"}

raklapCountries = {
    "BA": [
        [1746433, 5673462],
        [1732736, 5529638],
        [1926458, 5343743],
        [2010600, 5267428],
        [2045822, 5242969],
        [2153445, 5239055],
        [2192581, 5466042],
        [2168121, 5616715],
        [1816878, 5685203],
        [1746433, 5673462],
    ],
    "XK": [
        [2314880, 5370771],
        [2200897, 5286140],
        [2279658, 5096821],
        [2480718, 5242113],
        [2314880, 5370771],
    ]
}



def find_sublinestring(coords, linestring):

    if isinstance(linestring, LineString):
        for i, point1 in enumerate(coords[0]):
            for point2 in zip(linestring.xy[0], linestring.xy[1]):
                if point1 == point2:
                    return i
    elif isinstance(linestring, MultiLineString):
        # todo: temporal
        return None

        for i, point1 in enumerate(coords[0]):
            for line in linestring:
                for point2 in zip(line.xy[0], line.xy[1]):
                    if point1 == point2:
                        return i

    return None


def rnd_ring(x, y, r):
    theta = random.random() * 2 * math.pi
    return [x + math.cos(theta) * r, y + math.sin(theta) * r]


def signed_area(pr):
    """Return the signed area enclosed by a ring using the linear time
algorithm at http://www.cgafaq.info/wiki/Polygon_Area. A value >= 0
indicates a counter-clockwise oriented ring."""
    xs,ys = pr.exterior.xy
    xs.append(xs[1])
    ys.append(ys[1])
    L = len(xs)

    return sum(xs[i]*(ys[i+1]-ys[i-1]) for i in range(1, L-1))/2.0


def centroid(vertices):
    _x_list = [vertex.x for vertex in vertices]
    _y_list = [vertex.y for vertex in vertices]
    _len = len(vertices)
    _x = sum(_x_list) / _len
    _y = sum(_y_list) / _len

    return(_x, _y)


def forge_balkan(country_polys):
    with codecs.open('geojson/eastern/out_balkan.geojson', 'r', encoding='utf8') as fh:
        geojson = json.load(fh)
        out_balkan = shape(geojson['geometry'])

    for iso, coords in raklapCountries.items():
        rakpoly = Polygon(coords)
        polygon = rakpoly.difference(out_balkan)

        country_polys[iso] = polygon


def map_eastern(cache=False, direct=False):
    final_polys = []

    if not cache or not os.path.exists('geojson/eastern/eastern_polygroups.pkl'):
        country_polys = {}
        print("Loading helper countries...")
        with codecs.open('geojson/eastern/countries.geojson', 'r', encoding='utf8') as fh:
            geojson = json.load(fh)

            for feature in geojson['features']:
                iso3 = feature['properties']['ISO_A3']

                if iso3 not in countryISOMapping:
                    continue
                iso2 = countryISOMapping[iso3]
                if iso2 in exclude_worldmap:
                    continue

                try:
                    geolib.gps2merc_geom(feature['geometry'])
                except ValueError:
                    print("  skipped 1:", iso2)
                    pass

                country_polys[iso2] = shape(feature['geometry'])
            del geojson
        settlementGroups = defaultdict(list)


        print("Reading cities...")
        with codecs.open('geojson/eastern/worldcities.csv', 'r', encoding='utf8') as csvfile:
            spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

            for row in spamreader:
                iso = row['iso2'].upper()

                #if i % 10000:
                if iso not in eastern:
                    continue

                coord = gps2merc(float(row['lng']), float(row['lat']))

                settlementGroups[iso].append({
                    'coord': coord,
                    'name': row['city'],
                    'iso': iso
                })

        print("Forging Kosovo, Bosnia and Herzegovina...")
        forge_balkan(country_polys)

        print("Generating voronoi fields...")
        multicoordGroups = defaultdict(list)
        for iso, settlements in settlementGroups.items():
            multicoordGroups[iso].extend(voronoi(settlements))
        del settlementGroups


        print("Trimming voronoi fields...",end="")
        polygonGroups = defaultdict(list)
        for iso, pp in multicoordGroups.items():
            i = 0; L = len(pp); IC = round(L / 10)
            print("\n  " + iso, end="")
            for poly, prop in pp:
                if i % IC == 0:
                    print("  {}%".format(round((i / L) * 100)), end="")
                i+= 1

                # make difference between NUTS country border and the voronoi field
                voro_field = Polygon(poly)

                country = country_polys[prop['iso']]
                polygon = country.intersection(voro_field)
                polygonGroups[iso].append((polygon, prop))

        del multicoordGroups
        del country_polys

        print("Saving intermediate polygon groups...")
        with open("geojson/eastern/eastern_polygroups.pkl", "wb") as fh:
            pickle.dump(polygonGroups, fh)
    else:
        print("Loading intermediate polygon groups...")
        with open('geojson/eastern/eastern_polygroups.pkl', 'rb') as fh:
           polygonGroups = pickle.load(fh)

        # polygonGroups = {
        #     "RU": [
        #         (Polygon([[3745582.922510963,7507911.906093632],[3958176.0269150184,7503823.885527644],[3944326.9114191933,7364016.638005674],[3902566.5584322405,7295297.840994532],[3768420.381526098,7294402.615541907],[3745582.922510963,7507911.906093632]]), {
        #             "iso": "RU", "name": "Area 1"
        #         }),
        #         (Polygon([[3960592.409235474,7506477.986940317],[3991812.447166081,7505381.900562435],[4076931.0967454035,7489622.1267081145],[4081466.5990816425,7485807.400290077],[4132679.5838758387,7397227.250444],[4109714.230958874,7326106.047614089],[4084016.7008739603,7313692.0734513765],[3944326.9114191933,7364016.638005674],[3958176.0269150184,7503823.885527644],[3960592.409235474,7506477.986940317]]), {
        #             "iso": "RU", "name": "Area 2"
        #         })
        #     ]
        # }


    print("\nRandomizing voronoi fields...")
    already_covered = set()
    for iso, polygons in polygonGroups.items():
        print("\n  " + iso, end="")
        i = 0; L = len(polygons)**2; IC = round(L / min(10,L))

        for p1,p2 in product(range(len(polygons)),range(len(polygons))):
            if i % IC == 0:
                print("  {}%".format(round((i / L) * 100)), end="")
            i += 1

            polygon1, prop1 = polygons[p1]
            polygon2, prop2 = polygons[p2]

            if p1 == p2: #n1 == n2:
                continue

            # if we already generated segment for these 2 polygons, skip
            p = [p1,p2]; p.sort(); p = tuple(p)
            if p in already_covered: continue
            already_covered.add(p)

            # generate random triangles
            if polygon1.touches(polygon2):
                # intersection
                line_isect = polygon1.intersection(polygon2)

                if not isinstance(line_isect, LineString):# and not isinstance(line_isect, MultiLineString):
                    # intersection is a point, we're finished
                    continue

                poi1 = line_isect.interpolate(0, normalized=True)
                poi2 = line_isect.interpolate(1, normalized=True)
                cencen = line_isect.interpolate(0.5, normalized=True)

                cen1 = LineString([polygon1.centroid, cencen]).interpolate(0.5)
                cen2 = LineString([polygon2.centroid, cencen]).interpolate(0.5)

                # lines between centroids and interpolated intersection
                points = [poi1, poi2]

                # print('\nclear_points();')
                # print('add_point(',poi1.x, ',', poi1.y,');')
                # print('add_point(',poi2.x, ',', poi2.y,');')

                N = 1
                for i in range(1,N+1):
                    poi_int = line_isect.interpolate(i/(N+1), normalized=True)
                    segment = LineString([cen1, poi_int ,cen2])

                    ppe = segment.interpolate(random.uniform(0.45, 0.55), normalized=True)
                    # print('add_point(',ppe.x,',',ppe.y,');')
                    # find random point in segment
                    points.append(ppe)

                # sort points by anti-clockwise
                cen = centroid(points)
                def sorted_by(a: Point, b: Point):
                    aD = math.degrees( math.atan2(a.y - cen[1], a.x - cen[0]) )
                    bD = math.degrees( math.atan2(b.y - cen[1], b.x - cen[0]) )

                    return round(aD - bD)

                points = sorted(points, key=cmp_to_key(sorted_by))
                points.append(points[0])
                extra_poly = Polygon([[p.x, p.y] for p in points])

                if not extra_poly.is_valid:
                    print("FUCK", iso)
                    continue
                    #print("  correcting..")
                    for letstry in range(10):
                        points = sorted(points, key=cmp_to_key(sorted_by))
                        extra_poly = Polygon([[p.x, p.y] for p in points])

                        if extra_poly.is_valid:
                            break

                    if not extra_poly.is_valid:
                        # we give up, line stays straight
                        continue

                # 50% chance
                if polygon1.contains(extra_poly.centroid):
                    # rnd point is in polygon1, remove triangle and add it to poly2
                    polygon1 = polygon1.difference(extra_poly)
                    polygon2 = polygon2.union(extra_poly)
                elif polygon2.contains(extra_poly.centroid):
                    # rnd point is in polygon2
                    polygon1 = polygon1.union(extra_poly)
                    polygon2 = polygon2.difference(extra_poly)

                polygons[p1] = polygon1, prop1
                polygons[p2] = polygon2, prop2

    #del polygonGroups


    for polygons in polygonGroups.values():
       final_polys.extend(polygons)


    print("Saving files...")
    newgeo = geolib.create_geojson()
    i = 0
    for poly, prop in final_polys:
        # create feature
        newgeo['features'].append({
            'id': 'e{}'.format(i),
            'type': 'Feature',
            'properties': {
                'name': prop['name'],
                'iso': eastern.get(prop['iso'], prop['iso']),
            },
            'geometry': mapping(poly),
            #'geometry': {
            #    'type': 'Polygon',
            #    'coordinates': [poly]
            #}
        })
        i+=1

    loc = 'geojson/eastern/eastern_europe.geojson' if not direct else 'GeoEditor/public/geojson/eastern_europe.geojson'
    with codecs.open(loc, 'w', encoding='utf8') as fh:
        json.dump(newgeo, fh, cls=EntityJSONEncoder)


def save_countries():
    newgeo = geolib.create_geojson()

    for iso, poly in country_polys.items():
        newgeo['features'].append({
            'id': str(random.random()),
            'type': 'Feature',
            'properties': {
                'iso': iso,
            },
            'geometry': mapping(poly),
        })

    with codecs.open('GeoEditor/public/geojson/balkan.geojson', 'w', encoding='utf8') as fh:
        json.dump(newgeo, fh, cls=EntityJSONEncoder)



if __name__ == "__main__":

    if len(sys.argv) > 1 and sys.argv[1] == 'newks':
        forge_balkan()

        save_countries()
    else:
        map_eastern(cache=True, direct=True)
