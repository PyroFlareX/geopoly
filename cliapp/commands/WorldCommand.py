import json

from core.entities import World, Area
from core.instance import units, worlds
from core.services import areas


class WorldCommand():
    def __init__(self, cli):
        self.commands = {
            'world:create': {
                'help': 'Creates a world',
                'short': {},
                'long': []
            }
        }

    def runCreate(self):
        with open('generator/content/castles.json', 'r') as fh:
            castles = json.load(fh)

        world = World(max_players=12, turn_time=12, turns=0)
        worlds.create(world)

        castles = areas.load_areas(castles, world.wid, discover_fog=False)

        for area in castles:
            area.castle = 4
            area.virgin = True

        areas.areas.save_all(castles)

        # for area_id in castles:
        #     area = areas.load_area(area_id)
        #     area = Area(iso=)
        #
        # areas.save_all(lareas)
