from game.entities import User
from game.instance import worlds, countries
from game.services import game


class GameGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Game'

    def end_turn(self, user: User):
        if user.wid is None:
            return {"err": "not_in_match"}

        world = worlds.get(user.wid)
        world_countries = countries.list_in_world(world.wid)
        country = next(c for c in world_countries if c.iso == user.iso)

        # if len(match.isos) < 2:
        #     return {
        #         "err": "waiting_for_players"
        #     }

        try:
            if game.end_turn(world, country, world_countries):
                worlds.save(world)


                self.server.sendToMatch(match.mid, {
                    "route": "Game:end_turn",
                    "match": match.toView()
                })
            else:
                # it's not your turn
                pass
        except GameEndException as e:
            # game has ended, finalize stuff
            matches.delete(match)

            self.server.sendToMatch(match.mid, {
                "route": "Game:end_game",
                "reason": e.reason
            })
