import json
from random import choice

from flask import render_template, request
from werkzeug.utils import redirect

from core.factories.units import create_team, create_unit
from core.instance import worlds, areas, units, users
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class WorldsController():
    def __init__(self, server):
        self.server = server
        self.group = "Worlds"

    def post_player(self):
        iso = request.form['iso']
        name = request.form['name']
        age = int(request.form['age'])
        weights = json.loads(request.form['weights'])

        # todo: refactor to a service :(

        # todo: later: find random world
        world = worlds.list_all()[0]

        user = getUser()

        # save world reference
        user.wid = world.wid
        user.iso = iso

        # fetch an empty area
        lareas = areas.list_castle_virgin_by_iso(iso, world.wid)
        area = choice(lareas)

        if not area:
            return ApiResponse({
                'err': 'area_not_found'
            })

        # claim area
        area.pid = user.uid
        area.iso = iso
        area.virgin = False

        # create initial team
        lunits = create_team(iso=iso,wid=world.wid,pid=user.uid,aid=area.id)

        HERO = 10
        hero = create_unit(iso=iso, wid=world.wid, pid=user.uid, aid=area.id, img_vector=weights, age=age, name=name, prof=HERO)
        lunits.append(hero)

        # save everything
        units.save_all(lunits)
        areas.save(area)
        users.save_world(user)

        return ApiResponse({
            'wid': world.wid
        })
