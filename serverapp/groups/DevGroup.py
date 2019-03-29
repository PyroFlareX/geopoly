import time

from eme.websocket import WSClient

from core.exceptions import JoinException
from core.factories import create_match
from core.entities import User, Match, Area
from core.instance import matches, areas
from core.managers.TestManager import TestManager
from core.services import turns, moves, claim
from serverapp.server import GeopolyServer


class DevGroup:

    def __init__(self, server):
        self.server: GeopolyServer = server
        self.group = 'Dev'

    def ai_act(self, user: User):
        match: Match = matches.get(user.mid)

        while match.current != user.iso:
            # fake ai, skips its turn
            ai_user = User(mid=user.mid, iso=match.current)
            print("Skipping turn", match.current)

            self.server.groups['Game'].end_turn(ai_user)

            time.sleep(0.080)

    def setup(self, user: User):
        """
        Testing controller, this will:
            - authenticate the user
            - setup an example match if it's not present
        """

        if not self.server.debug:
            return

        tm = TestManager()
        mid = tm.mid
        match: Match = matches.get(tm.mid)


        try:
            # join to match
            claim.join_match(match, "AT", user, "Guest")
        except JoinException as e:
            return {
                "err": e.reason
            }

        # Remove from hall and add to match
        self.server.onlineHall.remove(user.client)
        self.server.onlineMatches[mid].add(user.client)

        matches.save(match)

        # Add user to server
        user = User(iso='AT', mid=match.mid)

        if user.mid:
            self.server.onlineMatches[user.mid].add(user.client)

        if match.current != user.iso:
            # let ai skip their turns
            self.ai_act(user)

        return {
            "me": True
        }
