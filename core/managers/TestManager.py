import time

from eme.websocket import WSClient

from core.factories import create_match
from core.entities import User, Match, Area
from core.instance import matches, areas
from core.services import turns, moves


class TestManager:

    def __init__(self):
        self.mid = '026b853c-630a-4290-97e3-20b451ef4e74'

    def setup_fake_match(self):
        mid = self.mid
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

