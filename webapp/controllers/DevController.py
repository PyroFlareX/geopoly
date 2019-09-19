from collections import OrderedDict

from flask import request

from game.entities import World, Country
from game.instance import countries, areas, worlds, users, histories
from game.services import turns
from game.services.startgame import create_world_entities, start_world, reset_world
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class DevController():
    def __init__(self, server):
        self.server = server
        self.group = "Dev"

    def index(self):
        dead = countries.list_eliminated(wid='790b9a91-b051-416b-ab43-29c60ac24c3e')

        return str([c.iso for c in dead])

    def reset(self):
        user = getUser()
        world = worlds.get(user.wid)

        reset_world(world)

        return ApiResponse({

        })

    def purge(self):
        # exclude our dear admin
        user = getUser()
        obo = users.find_user(username='oboforty')

        if obo.uid != user.uid:
            return 'No rights'

        users.set_world(obo.uid, None, None)

        # delete all test users
        lworlds = worlds.list_all()

        for world in lworlds:
            worlds.delete(world)

        # delete all entities
        users.delete_all_test()
        histories.delete_all()

        return 'Purged everything :)'

    def force_turn(self):
        user = getUser()
        world = worlds.get(user.wid)

        country: Country = countries.get(world.current, world.wid)
        world_countries = countries.list_all(world.wid)
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

    def new_world(self):
        user = getUser()

        if not user.username:
            return "Login first"

        world = World(name="Test world", map='map_hu', max_rounds=None)
        worlds.save(world)

        start_world(world, AI=True)

        user.wid = world.wid
        user.iso = 'UK'
        users.save(world)


        return 'New world created: {}'.format(world.wid)

    def new(self):
        """creates fake match"""

        user = getUser()
        if user.wid:
            return redirect('/')

        world = worlds.get_first()
        if not world:
            world = service.create(name="Test")

        ##service.join(user, world, "UK")

        users.set_world(user.uid, world.wid, user.iso)
        worlds.save(world)

        return redirect('/')

