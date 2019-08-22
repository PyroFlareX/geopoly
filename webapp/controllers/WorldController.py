from game.instance import worlds, users, countries, areas

from webapp.entities import ApiResponse
from webapp.services.login import getUser


class WorldController():
    def __init__(self, server):
        self.server = server
        self.group = "World"

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
            "player_names": {player.iso: player.username for player in players},
        })
