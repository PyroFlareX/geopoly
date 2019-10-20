

from collections import OrderedDict

from flask import request, render_template

from game.entities import World, Country
from game.instance import countries, areas, worlds, users, histories
from game.services import turns
from game.services.startgame import create_world_entities, start_world, reset_world
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class AdminDevController():
    def __init__(self, server):
        self.server = server
        self.group = "AdminDev"


    def new_world(self):
        user = getUser()

        if not user.username:
            return "Login first"

        world = World(name="Test world", map='hu_test', max_rounds=None)
        worlds.save(world)

        start_world(world, AI=True)

        user.wid = world.wid
        user.iso = 'UK'
        users.save(world)


        return 'New world created: {}'.format(world.wid)

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
