import json

from core.entities import Unit, Area
from core.factories.units import create_unit
from core.services import battle


class BattleTest():
    def __init__(self, app):
        self.app = app

    def _un(self, id, iso):
        #unit = self.app.readMock('unit{}'.format(id), Unit)
        #unit.iso = iso

        unit = create_unit(prof=id, iso=iso)

        return unit

    def test_calculate(self):
        units_fr = [
            self._un(0, 'HU'),self._un(0, 'HU'),self._un(0, 'HU'),self._un(1, 'HU'),self._un(1, 'HU'),
            self._un(4, 'HU'),self._un(4, 'HU'),self._un(2, 'HU'),self._un(3, 'HU')
        ]
        units_to = [
            self._un(0, 'AT'),self._un(0, 'AT'),self._un(0, 'AT'),self._un(1, 'AT'),self._un(1, 'AT'),
            self._un(4, 'AT'),self._un(4, 'AT'),self._un(2, 'AT'),self._un(3, 'AT')
        ]
        area_fr = Area(iso='HU')
        area_to = Area(iso='AT', castle=3)

        resp = battle.simulate_battle(area_fr, area_to, units_fr, units_to, make_report=True)

