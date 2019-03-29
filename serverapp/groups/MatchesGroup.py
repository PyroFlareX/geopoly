from core.entities import User
from core.exceptions import JoinException
from core.factories import create_match
from core.instance import matches, decks, areas
from core.managers.DeckManager import DeckManager
from core.services import turns, moves, claim


class MatchesGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Matches'
        self.deckManager = DeckManager()

    def list(self, user: User):
        if user.mid:
            return

        lmatches = matches.get_all(raw=True)

        return {
            "matches": lmatches
        }

    def create(self, map, max_players, max_rounds, user):
        match = create_match(map=map, max_players=max_players, max_rounds=max_rounds)

        matches.create(match)

        self.server.sendToHall({
            "route": "Matches:create",
            "msid": user.client.msid,

            "match": match.toView()
        })

    def join(self, aid, did, mid, iso, username, user):
        """
        User joins match
        """
        match = matches.get(mid)
        deck = self.deckManager.get(user.uid, did)
        area = areas.get(mid, aid)

        try:
            # todo: handle reconnect

            # join to match
            claim.join_match(match, iso, user, username)

            # add deck
            claim.add_units(area, deck)
        except JoinException as e:
            return {
                "err": e.reason
            }

        # Remove from hall and add to match
        self.server.onlineHall.remove(user.client)
        self.server.onlineMatches[mid].add(user.client)

        matches.save(match)
        areas.save(area)

        self.server.sendToMatch(mid, {
            "route": "Matches:join",

            "match": match.toView(),
            "area": area.toView(),

            "mid": mid,
            "iso": iso,
            "username": username,
        })

    def start(self, mid, user):
        match = matches.get(mid)

        # start match
        turns.init(match)
        moves.reset_map(match)

        matches.save(match)

        self.server.sendToMatch(mid, {
            "match": match.toView()
        })
