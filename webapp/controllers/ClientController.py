import uuid

from flask import render_template, request

from core.factories.units import create_team
from core.instance import units, areas
from core.services.areas import discover_areas, load_areas_raw
from serverapp.services import login
from webapp.entities import ApiResponse


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"


    def index(self):
        #ws_address = self.server.conf['websocket']['address']

        return render_template('/client/index.html',
           #ws_address=ws_address,
           debug=True,
           err=request.args.get('err')
        )

    def get_load(self):
        # Todo: dont fake player :(
        pid = '210845bf-8cc8-41b0-9049-583f0723e16a'
        iso = "HU"

        lunits = units.list_by_player(pid=pid)

        area_ids = set()
        vunits = []

        for unit in lunits:
            vunits.append(unit.toView())
            area_ids.add(unit.aid)

        geojson_areas = load_areas_raw(area_ids)

        return ApiResponse({
            "iso": iso,
            "units": vunits,
            "areas": geojson_areas,
        })

    def get_units(self):
        uid = uuid.uuid4()
        wid = uuid.uuid4()
        iso = 'HU'
        aid = 'AT1'

        lunits = create_team(wid=wid, uid=uid, iso=iso, aid=aid)

        return ApiResponse({
            'units': [unit.toDict() for unit in lunits]
        })
