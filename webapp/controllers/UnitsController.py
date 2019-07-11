import json
from uuid import UUID

from flask import request

from core import rules
from core.instance import worlds
from core.services import moves
from webapp.entities import ApiResponse


from core.services import battle
from webapp.services.login import getUser


class UnitsController():
    def __init__(self, server):
        self.server = server
        self.group = "Units"

        self.server.addUrlRule({
        })


    def patch_move(self):
        user = getUser()

        if not user.wid or not user.iso:
            return

        units = json.loads(request.form['units'])
        path = request.form['path']
        is_attack = bool(request.form['attack'])

        for unit in units:
            # not our unit >:(
            if unit.pid != user.uid or unit.wid != user.wid or unit.iso != user.iso:
                return

        if '[' in path:
            # this is pro json validation, ok!?!
            path = json.loads(path)
            resp = moves.bulk_move_path(units, user.wid, path, is_attack=is_attack)
        else:
            resp = moves.bulk_move_to(units, user.wid, path, is_attack=is_attack)

        return ApiResponse({
            'move': resp
        })

    def get_config(self):
        return ApiResponse(rules.units_conf)
