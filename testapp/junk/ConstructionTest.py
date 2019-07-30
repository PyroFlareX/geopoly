from unittest import mock

from game.entities import Construction, Town
from game.helpers.iterators import get_building
from game.services import Building


FAKE_TIME_INCREMENT = 0
def fake_time():
    return 10000 + FAKE_TIME_INCREMENT


class ConstructionTest():
    def __init__(self, server):
        self.server = server

    @mock.patch('time.time', mock.MagicMock(side_effect=fake_time))
    def test_construct_resource(self):
        global FAKE_TIME_INCREMENT

        # Test resource field
        town: Town = self.server.readMock('town_default', Town)
        building = "crop3"

        crop_conf, _lvl = get_building(building, lvl=town.crop3 + 1)


        expected_constr = {
            'id': None,
            'wid': 1,
            'created_at': fake_time(),
            'field': building,
            'type': None,
            'loopcon': None,
            'level': town.crop3 + 1,
        }

        expected_town = {
            'clay': town.clay - crop_conf['clay'],
            'iron': town.iron - crop_conf['iron'],
            'money': town.money - crop_conf['money'],
            'crop': town.crop,
        }

        construction: Construction = Building.build(town, building)

        try:
            assert construction.toView() == expected_constr

            assert town.clay == expected_town['clay']
            assert town.iron == expected_town['iron']
            assert town.money == expected_town['money']
            assert town.crop == expected_town['crop']

            print("CONSTRUCT RESOURCE: success")
        except AssertionError as e:
            print("CONSTRUCT RESOURCE: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT RESOURCE: FAILNE: {}".format(e))
            raise e

    @mock.patch('time.time', mock.MagicMock(side_effect=fake_time))
    def test_construct_stop(self):
        global FAKE_TIME_INCREMENT

        # Test resource field
        town: Town = self.server.readMock('town_default', Town)
        building = "b_warehouse"

        construction: Construction = Building.build(town, building)

        try:
            assert construction is not None

            print("CONSTRUCT BUILD: success")
        except AssertionError as e:
            print("CONSTRUCT BUILD: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT BUILD: FAILNE: {}".format(e))
            raise e


        # now let's fake time
        b_warehouse, _lvl = get_building(building, lvl=1)
        FAKE_TIME_INCREMENT =  b_warehouse['time'] - 1

        try:
            assert not Building.check_building_ended(town, construction)

            print("CONSTRUCT !STOP: success")
        except AssertionError as e:
            print("CONSTRUCT !STOP: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT !STOP: FAILNE: {}".format(e))
            raise e

        # Now time has come:
        FAKE_TIME_INCREMENT = b_warehouse['time']

        try:
            assert Building.check_building_ended(town, construction)

            print("CONSTRUCT STOP: success")
        except AssertionError as e:
            print("CONSTRUCT STOP: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT STOP: FAILNE: {}".format(e))
            raise e

    def test_construct_maxlvl(self):
        town: Town = self.server.readMock('town_default', Town)
        building = "b_warehouse"

        town.b_warehouse = 10

        construction = Building.build(town, building)

        try:
            assert not construction

            print("CONSTRUCT ERR_MAXLVL: success")
        except AssertionError as e:
            print("CONSTRUCT ERR_MAXLVL: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT ERR_MAXLVL: FAILNE: {}".format(e))
            raise e

    def test_construct_errres(self):
        town: Town = self.server.readMock('town_default', Town)
        building = "b_warehouse"

        b_warehouse, _lvl = get_building(building, lvl=1)

        town.iron = b_warehouse['iron'] - 1

        construction = Building.build(town, building)

        try:
            assert not construction

            print("CONSTRUCT ERR_RES: success")
        except AssertionError as e:
            print("CONSTRUCT ERR_RES: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT ERR_RES: FAILNE: {}".format(e))
            raise e

    def test_construct_errlvl(self):
        town: Town = self.server.readMock('town_default', Town)
        building = "b_barracks"

        b_barracks, _lvl = get_building(building, town)

        construction = Building.build(town, building)

        town.b_main = 3
        construction2 = Building.build(town, building)

        try:
            assert not construction

            print("CONSTRUCT ERR_LVL: success")
        except AssertionError as e:
            print("CONSTRUCT ERR_LVL: FAIL")

            print('construction:')
            print(construction.toView())
        except Exception as e:
            print("CONSTRUCT ERR_LVL: FAILNE: {}".format(e))
            raise e

        try:
            assert construction2

            print("CONSTRUCT ERR_LVL2: success")
        except AssertionError as e:
            print("CONSTRUCT ERR_LVL2: FAIL")
        except Exception as e:
            print("CONSTRUCT ERR_LVL2: FAILNE: {}".format(e))
            raise e
