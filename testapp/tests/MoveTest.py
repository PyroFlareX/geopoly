import unittest

from game.entities import Country, Area
from game.services import movement

from engine.modules.geomap import service
from game.services.movement import MoveException

service.switch_conn_graph({
    "A1": ["A2"],
    "A2": ["A1","A3"],
    "A3": ["A2","A4"],
    "A4": ["A3"]
})

# uk = Country(iso='UK')
# fr = Country(iso='FR')


class MoveTest(unittest.TestCase):
    def test_nounit_fail(self):
        area1 = Area(id="A1", iso='UK')
        area2 = Area(id="A2", iso='FR')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'invalid_params')
        self.assertIsNone(area1.unit)
        self.assertIsNone(area2.unit)

    def test_occupied_fail(self):
        area1 = Area(id="A1", iso='UK', unit='cav')
        area2 = Area(id="A2", iso='UK', unit='inf')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'not_enemy')
        self.assertEqual(area1.unit, 'cav')
        self.assertEqual(area2.unit, 'inf')

    def test_disconnected_fail(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A5", iso='UK')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'cant_move_there')
        self.assertEqual(area1.unit, 'inf')
        self.assertEqual(area2.unit, None)

    def test_cavalry_step2_fail(self):
        area1 = Area(id="A1", iso='UK', unit='cav')
        area2 = Area(id="A3", iso='UK')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'cant_move_there')
        self.assertEqual(area1.unit, 'cav')
        self.assertEqual(area2.unit, None)

    def test_inf_attack2_fail(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A3", iso='FR', unit='cav')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'cant_attack_there')
        self.assertEqual(area1.unit, 'inf')
        self.assertEqual(area2.unit, 'cav')
        self.assertEqual(area2.iso, 'FR')

    def test_cavalry_forest_fail(self):
        area1 = Area(id="A1", iso='UK', unit='cav')
        area2 = Area(id="A2", iso='FR', unit='inf', tile='forest')

        with self.assertRaises(MoveException) as context:
            movement.move_to(area1, area2)
        self.assertEqual(context.exception.reason, 'cant_attack_cavalry')
        self.assertEqual(area1.unit, 'cav')
        self.assertEqual(area2.unit, 'inf')
        self.assertEqual(area2.iso, 'FR')

        # infantry can, however
        area3 = Area(id="A3", iso='UK', unit='inf')
        try:
            movement.move_to(area3, area2)
        except MoveException as e:
            self.fail("test_cavalry_forest_fail raised MoveException({}) unexpectedly!".format(e.reason))
        self.assertEqual(area3.unit, None)
        self.assertEqual(area2.unit, 'inf')
        self.assertEqual(area2.iso, 'UK')

    def test_mount_exhaust_pass(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A2", iso='UK', tile='mount')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_mount_exhaust_pass raised MoveException({}) unexpectedly!".format(e.reason))

        self.assertEqual(area2.exhaust, 2)

    def test_bridge_noexhaust_pass(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A2", iso='UK', tile='bridge')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_bridge_noexhaust_pass raised MoveException({}) unexpectedly!".format(e.reason))
        self.assertIsNone(area2.exhaust)

    def test_infantry_attack_pass(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A2", iso='FR', unit='cav')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_infantry_attack_pass raised MoveException({}) unexpectedly!".format(e.reason))

        self.assertEqual(area1.unit, None)
        self.assertEqual(area1.iso, 'UK')

        self.assertEqual(area2.unit, 'inf')
        self.assertEqual(area2.iso, 'UK')

    def test_cavalry_attack_pass(self):
        area1 = Area(id="A1", iso='UK', unit='cav')
        area2 = Area(id="A3", iso='FR', unit='inf')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_cavalry_attack_pass raised MoveException({}) unexpectedly!".format(e.reason))

        self.assertEqual(area1.unit, None)
        self.assertEqual(area1.iso, 'UK')

        self.assertEqual(area2.unit, 'cav')
        self.assertEqual(area2.iso, 'UK')

    def test_cannon_attack_pass(self):
        area1 = Area(id="A1", iso='UK', unit='art')
        area2 = Area(id="A3", iso='FR', unit='inf')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_cannon_attack_pass raised MoveException({}) unexpectedly!".format(e.reason))

        self.assertEqual(area1.unit, 'art')
        self.assertEqual(area1.iso, 'UK')

        self.assertEqual(area2.unit, None)
        self.assertEqual(area2.iso, 'FR')

    def test_move_pass(self):
        area1 = Area(id="A1", iso='UK', unit='inf')
        area2 = Area(id="A2", iso='FR')

        try:
            movement.move_to(area1, area2)
        except MoveException as e:
            self.fail("test_move_pass raised MoveException({}) unexpectedly!".format(e.reason))

        self.assertEqual(area1.unit, None)
        self.assertEqual(area1.iso, 'UK')

        self.assertEqual(area2.unit, 'inf')
        self.assertEqual(area2.iso, 'UK')


if __name__ == '__main__':
    unittest.main()
