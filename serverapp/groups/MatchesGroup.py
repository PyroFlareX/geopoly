from core.entities import User
from core.exceptions import JoinException, GameEndException
from core.factories import create_match
from core.game import end_turn
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
            claim.add_units(area, deck, iso)
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

    def leave(self, user):
        """
        User leaves match
        """
        mid = user.mid
        iso = user.iso

        match = matches.get(user.mid)

        try:
            # leave match
            claim.leave_match(match, user)
        except JoinException as e:
            return {
                "err": e.reason
            }

        if match.current == iso:
            # if user has just left, let the turn be handled
            try:
                end_turn(match, iso)

                self.server.sendToMatch(match.mid, {
                    "route": "Game:end_turn",
                    "match": match.toView()
                })

            except GameEndException as e:
                # game has ended, finalize stuff
                matches.delete(match)

                self.server.sendToMatch(match.mid, {
                    "route": "Game:end_game",
                    "reason": e.reason
                })

        # Add to hall and remove from match
        self.server.onlineHall.add(user.client)
        self.server.onlineMatches[user.mid].remove(user.client)

        matches.save(match)

        self.server.sendToMatch(mid, {
            "route": "Matches:leave",

            "mid": mid,
            "iso": iso,
            "uid": user.uid,
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
