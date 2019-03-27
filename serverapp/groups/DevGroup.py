import time

from eme.websocket import WSClient

from core.factories import create_match
from core.entities import User, Match, Area
from core.instance import matches, areas
from core.services import turns, moves
from serverapp.server import GeopolyServer


class DevGroup:

    def __init__(self, server):
        self.server: GeopolyServer = server
        self.group = 'Dev'

        self.server.no_auth.update([
            'Dev:setup'
        ])

    def ai_act(self, user: User):
        match: Match = matches.get(user.mid)

        while match.current != user.iso:
            # fake ai, skips its turn
            ai_user = User(mid=user.mid, iso=match.current)
            print("Skipping turn", match.current)

            self.server.groups['Matches'].end_turn(ai_user)

            time.sleep(0.080)


    def setup(self, client: WSClient):
        """
        Testing controller, this will:
            - authenticate the user
            - setup an example match if it's not present
        """

        mid = '0000-test'
        match: Match = matches.get(mid)
        if not match:
            match = create_match()
            match.mid = mid

            match.isos = ['AT', 'DE', 'FR']

            matches.create(match)

            # set up match:
            area1 = Area(mid=mid, iso='AT', id='AT312', inf_light=200, inf_heavy=50, inf_skirmish=30, inf_home=100, cav_dragoon=50, cav_hussar=20)
            areas.create(area1)

            area1 = Area(mid=mid, iso='AT', id='AT323', inf_light=50, inf_heavy=21)
            areas.create(area1)

            area1 = Area(mid=mid, iso='DE', id='DE22', inf_light=50, inf_heavy=21)
            areas.create(area1)

            area1 = Area(mid=mid, iso='FR', id='FRF3', inf_light=50, inf_heavy=21)
            areas.create(area1)

            # start match
            turns.init(match)
            moves.reset_map(match)


        # Add user to server
        client.user = User(iso='AT', mid=match.mid)

        if client.user.mid:
            self.server.onlineMatches[client.user.mid].add(client)

        if match.current != client.user.iso:
            # let ai skip their turns
            self.ai_act(client.user)


        return {

        }
