from game.entities import World
from game.instance import countries, areas, worlds, users
from game.services.startgame import create_world_entities, start_world
from webapp.services.login import getUser


class DevController():
    def __init__(self, server):
        self.server = server
        self.group = "Dev"

    def index(self):
        dead = countries.list_eliminated(wid='790b9a91-b051-416b-ab43-29c60ac24c3e')

        return str([c.iso for c in dead])

    def new_world(self):
        user = getUser()

        if not user.username:
            return "Login first"

        world = World(name="Test world", map='map_hu', max_rounds=None)
        worlds.save(world)

        start_world(world)

        user.wid = world.wid
        users.save(world)


        return 'New world created: {}'.format(world.wid)
