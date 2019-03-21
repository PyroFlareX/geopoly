from core.entities import Match, User
from core.game import end_turn, GameEndException
from core.instance import matches


class MatchesGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Matches'


    def load(self, user: User):
        if not user.mid:
            return {"err": "no_match"}

        match: Match = matches.get(user.mid)

        return {
            "me": user.iso,
            "match": match.toView()
        }

    def end_turn(self, user: User):
        if not user.mid:
            return {"err": "no_match"}

        match: Match = matches.get(user.mid)

        try:
            if end_turn(match, iso=user.iso):
                return {
                    "match": match.toView()
                }
            else:
                # it's not your turn
                pass
        except GameEndException as e:
            matches.delete(match)

            return {
                "route": "Matches:end_game",
                "reason": e.end_reason
            }
