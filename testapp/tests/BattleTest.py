import json

from core.entities import Unit, Area
from core.factories.units import create_unit
from core.services import battle, areas

WID = "W_TEST"
PID = "P_TEST"


class BattleTest():
    def __init__(self, app):
        self.app = app
        self.app.WID = WID
        self.app.PID = PID

        areas.conn_graph = {
            "area1": ["area2", "area3"],
            "area2": ["area1", "area3"],
            "area3": ["area1", "area2"],
        }

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
            self._un(4, 'AT'),self._un(4, 'AT'),
            #self._un(11, 'AT'),
            self._un(11, 'AT'),
        ]
        area_fr = Area(iso='HU')
        area_to = Area(iso='AT', castle=3)

        resp = battle.simulate_battle(area_fr, area_to, units_fr, units_to, make_report=True)

    def test_pcas(self):
        pass
    def test_damagekill(self):
        pass

    def test_attack_win(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [3,3,3,3,3], id="fr{}")

        # to area
        area2 = self.app._area('area2', 'IE', castle=3)
        tounits = self.app._units(area2.id, 'IE', [0,0,1,2,2], 'to', id="to{}")

        try:
            resp, (dead_fr, dead_to) = battle.simulate_battle(area1, area2, myunits, tounits, make_report=True)

            assert resp['fr_str']['total'] > resp['to_str']['total']

            for unit1 in myunits:
                assert unit1.health > 0
                assert unit1.id not in dead_fr

            for unit2 in tounits:
                assert unit2.health == 0
                assert unit2.id in dead_to

            assert myunits[0].health != 100

            print("ATTACK_WIN: Success")
        except (AssertionError) as e:
            print("ATTACK_WIN: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("ATTACK_WIN: FailNE: {}".format(e))
            raise e

    def test_damage_symmetry(self):
        pass
        # test if def/att roles don't matter (unless there's a castle involved for to)

    def test_siege(self):
        pass
        # covers 1/4 failing cases of damage_symmetry
