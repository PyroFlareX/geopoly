from flask import render_template, request
from werkzeug.utils import redirect

from engine import settings
from game.instance import worlds, users, countries, areas, histories

from webapp.entities import ApiResponse
from webapp.services.login import getUser


class WorldsController():
    def __init__(self, server):
        self.server = server
        self.group = "Worlds"

    def load(self):
        user = getUser()

        world = worlds.get(user.wid)
        _countries = countries.list_all(user.wid)
        players = users.list_all(user.wid)
        _areas = areas.list_all(user.wid)

        return ApiResponse({
            "world": world.to_dict(),
            "countries": _countries,
            "areas": _areas,
            "players": {player.iso: player.to_game_view() for player in players},
        })

    def index(self):
        user = getUser()

        if user.username is None:
            return redirect('/')

        if user.uid == 'None':
            raise Exception("hifga iiii Volume II")

        return render_template('/worlds/index.html', conf=settings._conf)

    def history(self):
        user = getUser()

        if user.username is None:
            return redirect('/')

        l_histories = histories.list_results_user(user.uid)

        return render_template('/worlds/history.html',
            histories=[(h.to_dict(), r.to_dict()) for h,r in l_histories],
            err=request.args.get('err')
        )
