import json
import re
import sys

from game.entities import Country, Area


def load_gtml(filename):
    l_countries = []
    l_areas = []
    l_calls = []

    f_countries = []

    area_pattern = re.compile(r"(?P<id>\w+)\((?P<iso>\w*),?(?P<buildtile>\w*),?(?P<unit>\w*)\)")

    with open(filename) as fh:
        status = None

        for line in fh:
            if not line or line[0] == '#' or line[0] == '\n':
                continue
            if line[0] == '>':
                status = line[1:-1]

                if status == 'STOP_TEST':
                    l_calls.append((status,None))
                    break
                elif status[:9] == 'COUNTRIES':
                    f_countries = status[10:].split()
                    status = 'COUNTRIES'

                continue

            if status == 'COUNTRIES':
                attrs = line.split()
                cc = Country()

                for val,attr in zip(attrs, f_countries):
                    if attr in ('iso','name','color'):
                        setattr(cc, attr, val)
                    elif attr in ('emperor', 'ai'):
                        setattr(cc, attr, bool(val))
                    else:
                        setattr(cc, attr, int(val))

                l_countries.append(cc)
            elif status == 'AREAS':
                match = area_pattern.findall(line)

                for (aid, iso, btile, unit) in match:
                    area = Area(id=aid)

                    if iso:
                        area.iso = iso

                    if btile in ('barr','house','cita'):
                        area.build = btile
                        area.tile = 'city'
                    else:
                        area.tile = btile

                    if unit:
                        area.unit = unit

                    l_areas.append(area)

            elif status == 'TEST_AREAS':
                ff = []

                sareas = line.split()

                for sarea in sareas:
                    sarea = sarea.split(',')
                    area = Area(iso=sarea[0])

                    if len(sarea) > 1 and sarea[1]:
                        tile = sarea[1]
                        if tile in ('barr','house','cita'):
                            area.tile = 'city'
                            area.build = tile
                        else:
                            area.tile = tile
                    if len(sarea) > 2:
                        area.unit = sarea[2]

                    ff.append(area)
                l_areas.append(ff)
            elif status == 'TEST_CALLS':
                method,params,iso,exps = line.split()

                params = params.split(',')

                try:
                    exp_js = list(map(json.loads, exps.split('|')))
                except:

                    raise Exception("Failed to parse call: {}".format(exps))

                if method == 'BUY':
                    call = ('Game:buy', {'area_id': params[0], 'item_id': params[1]}, iso)
                elif method == 'MOVE':
                    call = ('Game:move', {'area_id': params[0], 'to_id': params[1]}, iso)
                elif method == 'END':
                    call = ('Game:end_turn', {}, iso)
                else:
                    continue

                l_calls.append((call, exp_js))

    return l_countries, l_areas, l_calls
