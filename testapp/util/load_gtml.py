import json

from game.entities import Country, Area


def load_gtml(filename):
    l_countries = []
    l_areas = []
    l_calls = []

    with open('testapp/content/'+filename) as fh:
        status = None

        for line in fh:
            if not line or line[0] == '#' or line[0] == '\n':
                continue
            if line[0] == '>':
                status = line[1:-1]

                if status == 'STOP_TEST':
                    l_calls.append((status,None))
                    break

                continue

            if status == 'COUNTRIES':
                iso,gold,shield,conquers = line.split()
                l_countries.append(Country(iso=iso, gold=int(gold), shields=int(shield),conquers=int(conquers)))
            elif status == 'AREAS':
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
            elif status == 'CALLS':
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
