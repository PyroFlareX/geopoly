import uuid

from flask import render_template, request
from werkzeug.utils import redirect

from core.instance import units, areas, worlds
from core.services.areas import load_areas_raw
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"

    def index(self):
        #ws_address = self.server.conf['websocket']['address']
        user = getUser()

        if not user.wid:
            return redirect('/client/welcome')

        return render_template('/client/index.html',
            #ws_address=ws_address,
            debug=True,
            err=request.args.get('err')
        )

    def new(self):
        user = getUser()
        if user.wid:
            return redirect('/')

        return render_template('/client/new.html',
            debug=True,
            err=request.args.get('err')
        )

    def welcome(self):
        user = getUser()

        return render_template('/client/welcome.html',
            debug=True,
            err=request.args.get('err')
        )

    def get_load(self):
        # Todo: dont fake player :(
        pid = '210845bf-8cc8-41b0-9049-583f0723e16a'
        iso = "HU"
        world = worlds.list_all()[0]

        lunits = units.list_by_player(pid=pid)

        area_ids = set()
        vunits = []

        for unit in lunits:
            vunits.append(unit.toView())
            area_ids.add(unit.aid)

        geojson_areas = load_areas_raw(area_ids, wid=world.wid, discover_fog=True)

        return ApiResponse({
            "iso": iso,
            "units": vunits,
            "areas": geojson_areas,
        })
