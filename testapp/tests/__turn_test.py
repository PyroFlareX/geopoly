import unittest

from modules.turns.core.service import TurnBox
from modules.turns.manual.entities import World


class TestStringMethods(unittest.TestCase):

    def test_new(self):
        world = World()

        players = [
            'P1', 'P2', 'P3', 'P4'
        ]

        tb = TurnBox(world, players)
        tb.start()

        self.assertEqual(list(tb.deque), players)
        self.assertEqual(tb.world.current, 'P1')

    def test_load(self):
        world = World(current='P3', turns=6, rounds=3)

        players = [
            'P1', 'P2', 'P3', 'P4'
        ]

        tb = TurnBox(world, players)
        tb.start()

        self.assertEqual(list(tb.deque), ['P3', 'P4', 'P1', 'P2'])
        self.assertEqual(tb.world.current, 'P3')

        self.assertEqual(tb.next(), 'P4')
        self.assertEqual(tb.world.turns, 8)
        self.assertEqual(tb.world.rounds, 3)

    def test_cyclic(self):
        world = World()
        players = ['P1', 'P2', 'P3', 'P4']

        tb = TurnBox(world, players)

        # NEW ROUND
        self.assertEqual(tb.world.rounds, 0)
        self.assertEqual(tb.start(), 'P1')
        self.assertEqual(tb.world.rounds, 1)
        self.assertEqual(tb.world.turns, 1)
        self.assertEqual(tb.next(), 'P2')
        self.assertEqual(tb.world.rounds, 1)
        self.assertEqual(tb.world.turns, 2)
        self.assertEqual(tb.next(), 'P3')
        self.assertEqual(tb.world.rounds, 1)
        self.assertEqual(tb.world.turns, 3)
        self.assertEqual(tb.next(), 'P4')
        self.assertEqual(tb.world.rounds, 1)
        self.assertEqual(tb.world.turns, 4)

        self.assertEqual(tb.next(), None)
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 4)
        self.assertEqual(tb.next(), None)
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 4)


        # NEW ROUND
        self.assertEqual(tb.start(), 'P1')
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 5)
        self.assertEqual(tb.next(), 'P2')
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 6)
        self.assertEqual(tb.next(), 'P3')
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 7)
        self.assertEqual(tb.next(), 'P4')
        self.assertEqual(tb.world.rounds, 2)
        self.assertEqual(tb.world.turns, 8)

        self.assertEqual(tb.next(), None)
        self.assertEqual(tb.world.rounds, 3)
        self.assertEqual(tb.world.turns, 8)
        self.assertEqual(tb.next(), None)
        self.assertEqual(tb.world.rounds, 3)
        self.assertEqual(tb.world.turns, 8)


if __name__ == '__main__':
    unittest.main()
