from core.entities import Match, User
from core.factories import create_match
from core.game import end_turn
from core.exceptions import GameEndException
from core.instance import matches


class GameGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Game'

    def load(self, user: User, mid=None):
        if mid is None:
            if user.mid is None:
                return {"err": "not_in_match"}
            else:
                mid = user.mid

        match: Match = matches.get(mid)

        if match is None:
            return {"err": "not_found"}

        # generate player list from users
        playerlist = [user.toView() for user in self.server.getUsersAt(mid)]

        return {
            "me": user.iso and user.mid,
            "match": match.toView(),
            "players": playerlist,
            #"countries": countries
        }

    def end_turn(self, user: User):
        if user.mid is None:
            return {"err": "not_in_match"}

        match: Match = matches.get(user.mid)

        if len(match.isos) < 2:
            return {
                "err": "waiting_for_players"
            }

        try:
            if end_turn(match, iso=user.iso):
                matches.save(match)

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
