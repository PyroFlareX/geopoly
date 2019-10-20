from collections import OrderedDict

from flask import request, render_template

from game.entities import World, Country
from game.instance import countries, areas, worlds, users, histories
from game.services import turns
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class TestDevController():
    def __init__(self, server):
        self.server = server
        self.group = "TestDev"


    def index(self):

        return render_template('/client/test.html')

    def force_turn(self):
        user = getUser()
        world = worlds.get(user.wid)

        country: Country = countries.get(world.current, world.wid)
        world_countries = world.countries
        dict_countries = OrderedDict((c.iso, c) for c in world_countries)

        if not country:
            # ???
            return

        try:
            round_end_events = turns.end_turn(world, country, dict_countries)
        except turns.TurnException as e:
            return {"err": e.reason}
        except turns.EndGameException as e:
            # fake end game: used for playtesting
            # we don't schedule the world to be deleted and don't give ratings
            return ApiResponse({
                "route": "Game:end_game",
                "winner": e.reason
            })

        worlds.save(world)

        return ApiResponse({
            "route": "Game:end_turn",
            "iso": country.iso,
            "turn_end": {
                "turns": world.turns,
                "current": world.current,
            },
            "round_end": round_end_events.to_dict() if round_end_events else None
        })
