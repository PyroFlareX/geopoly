from core.entities import Match, User
from core.game import end_turn
from core.exceptions import GameEndException
from core.instance import matches


class MatchesGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Matches'


    def load(self, user: User):
        if user.mid is None:
            return {"err": "not_in_match"}

        match: Match = matches.get(user.mid)

        # generate player list from users
        playerlist = [user.toView() for user in self.server.getUsersAt(user.mid)]

        return {
            "me": user.iso,
            "match": match.toView(),
            "players": playerlist,
            #"countries": countries
        }

    def end_turn(self, user: User):
        if user.mid is None:
            return {"err": "not_in_match"}

        match: Match = matches.get(user.mid)

        try:
            if end_turn(match, iso=user.iso):
                matches.save(match)

                self.server.sendToMatch(match.mid, {
                    "route": "Matches:end_turn",
                    "match": match.toView()
                })
            else:
                # it's not your turn
                pass
        except GameEndException as e:
            # game has ended, finalize stuff
            matches.delete(match)

            self.server.sendToMatch(match.mid, {
                "route": "Matches:end_game",
                "reason": e.reason
            })
