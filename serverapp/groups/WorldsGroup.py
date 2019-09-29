from engine import settings
from game.entities import User, World
from game.instance import worlds, users
from game.services.startgame import create_world, join_world, set_map


class WorldsGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Worlds'

    def list(self, user):
        l_worlds = []

        for world in worlds.list_in_hall():
            dd = world.to_dict()

            clients = self.server.onlineMatches[str(world.wid)]
            dd['players'] = [c.user.iso for c in clients]
            l_worlds.append(dd)

        return {
            "worlds": l_worlds
        }

    def join(self, wid, user, iso=None):
        world = worlds.get(wid)

        if not world:
            # world ceased to exist, kick user out
            user.wid = None
            user.iso = None
            users.set_world(user.uid, user.wid, user.iso)
            return

        clients = self.server.onlineMatches[str(world.wid)]
        players = {c.user.iso: c.user.to_dict() for c in clients}

        if world is None:
            return

        if not join_world(user, world, players, iso=iso):
            return

        self.server.client_enter_world(user.client)

        self.server.send_to_world(world.wid, {
            "route": "Worlds:joined",
            "user": user.to_dict(),
        })

        dd = world.to_dict()
        dd['players'] = players

        return {
            "world": dd,
            "user": user.to_dict(),
        }

    def create(self, user):
        world, l_countries = create_world()

        worlds.save(world)

        return self.join(world.wid, user)

    def edit(self, patch: dict, user):
        # edit map + max_players
        # + deny if too many players
        world = worlds.get(user.wid)

        if set_map(world, patch['map']):
            self.server.send_to_world(world.wid, {
                "route": "Worlds:edit",
                "patch": patch,
            })

    def leave(self, user):
        world = worlds.get(user.wid)

        self.server.send_to_world(world.wid, {
            "route": "Worlds:left",
            "iso": user.iso,
        })

        self.server.client_leave_world(user.client)

        if settings.get('client.leave_world_on_disconnect'):
            user.wid = None
            user.iso = None
            users.set_world(user.uid, None, None)

        # delete match if it hasn't started yet
        if world.rounds == 0:
            clients = self.server.onlineMatches[str(world.wid)]
            if len(clients) == 0:
                print("DELETING MATCH", world.wid)
                worlds.delete(world)

        return {}
