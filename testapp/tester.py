import json
from unittest.mock import MagicMock

import numpy as np
from eme.tests import TestApp

from game.entities import Area
from game.factories.units import create_unit
from game.services import moves

np.set_printoptions(precision=2)
np.set_printoptions(suppress=True)
np.set_printoptions(linewidth=200)


class GeopolyTester(TestApp):

    def __init__(self):
        super().__init__(directory='testapp/')

        self.WID = "W_TEST"
        self.PID = "P_TEST"

    def readMock(self, name, entity):

        with open('testapp/mocks/{}.json'.format(name)) as fh:
            content = json.load(fh)

        return entity(**content)

    def _area(self, id, iso='UK', castle=0):
        area = Area(id=id, wid=self.WID, pid=self.PID, iso=iso, virgin=0)
        area.castle = castle

        return area

    def _units(self, area_id, iso, profs, dir='from', id='{}'):
        allunits = []
        for i,prof in enumerate(profs):
            unit = create_unit(prof=prof, iso=iso, aid=area_id, wid=self.WID, pid=self.PID)
            unit.id = id.format(i)
            allunits.append(unit)

        if dir == 'to':
            moves.units.list_by_area = MagicMock(return_value=allunits)

        return allunits
