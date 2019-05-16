import json
from uuid import UUID

from flask import request

from core import rules
from core.instance import worlds
from core.services import moves
from webapp.entities import ApiResponse


class UnitsController():
    def __init__(self, server):
        self.server = server
        self.group = "Units"

        self.server.addUrlRule({
        })


    def patch_move(self):
        units = json.loads(request.form['units'])
        path = json.loads(request.form['path'])

        wid = worlds.list_all()[0].wid
        pid = '210845bf-8cc8-41b0-9049-583f0723e16a'

        resp = moves.bulk_move_to(units, wid, path, UUID(pid))

        return ApiResponse({
            'move': resp
        })

    def get_config(self):
        return ApiResponse(rules.units)
