from flask import render_template, request

from game.entities import World
from game.instance import worlds, users, histories
from game.services.startgame import start_world
from game.util.load_gtml import load_isos
from webapp.entities import ApiResponse


class PlaytestController():
    def __init__(self, server):
        self.server = server
        self.group = "Playtest"

        # Playtest Singleton ID:
        self.WID = '00000000-0000-2000-a000-000000000000'
        self.tmp_players = {}

    def index(self):
        l_users = users.list_some(N=10)

        return render_template('/playtest/index.html', users=[u.to_dict() for u in l_users])

    def start(self):
        uids = request.args['uids'].split(',')

        world = worlds.get(self.WID)
        l_users = users.list(uids)

        # delete world
        if world is not None:
            worlds.delete(world)

            h = histories.get(self.WID)
            if h is not None:
                histories.delete(h)

        # create world
        world = World(wid=self.WID, name="Playtest world", map='map_hu', max_rounds=None)

        isos = load_isos('game/maps/{}.gtml'.format(world.map))
        if len(isos) < len(l_users):
            return ApiResponse({
                'result': False,
                'no': len(isos)
            })

        # force-enter users:
        for user, iso in zip(l_users, isos):
            user.wid = world.wid
            user.iso = iso

        # Save everything and start the game
        worlds.save(world)
        start_world(world, AI=True)
        users.save_all(l_users)

        return ApiResponse({
            'result': 'OK'
        })
