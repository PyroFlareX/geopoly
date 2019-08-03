from unittest import TestCase, mock

from game.entities import World, Country
from game.services import game
from game.services.game import TurnException

players = [
    'P1', 'P2', 'P3', 'P4'
]


@mock.patch('game.services.game.db_areas')
@mock.patch('game.services.game.db_countries')
class RoundTests(TestCase):
    def _set_up(self):
        world = World(current='P4')
        countries = [
            Country(iso='P1', gold=0, pop=0, shields=7, conquers=0),
            Country(iso='P2', gold=0, pop=0, shields=7, conquers=0),
            Country(iso='P3', gold=0, pop=0, shields=7, conquers=0),
            Country(iso='P4', gold=0, pop=0, shields=7, conquers=0)
        ]

        return world, countries, countries[3]

    def test_simple_round(self, mock_countries, mock_areas):
        world, countries, curr = self._set_up()

        resp = game.end_turn(world, curr, countries)

        self.assertIsNotNone(resp)

        # check calls
        mock_areas.set_decrement_exhaust.assert_called()
        mock_areas.list_empty.assert_called()
        mock_countries.set_pop.assert_called()

        mock_countries.set_payday.assert_not_called()

        self.assertEqual(len(resp.eliminated), 0)
        self.assertEqual(len(resp.killed), 0)

        self.assertIsNone(resp.emperor, None)
        self.assertIsNone(resp.payday, None)

    def test_payday(self, mock_countries, mock_areas):
        world, countries, curr = self._set_up()
        countries[3].conquers = 1
        countries[2].conquers = 1
        countries[1].shields -= 1
        countries[2].shields -= 1

        resp = game.end_turn(world, curr, countries)

        # check calls
        mock_areas.set_decrement_exhaust.assert_called()
        mock_areas.list_empty.assert_called()
        mock_countries.set_pop.assert_called()
        mock_countries.set_payday.assert_called()

        self.assertEqual(len(resp.eliminated), 0)
        self.assertEqual(len(resp.killed), 0)

        self.assertIsNone(resp.emperor)
        self.assertIsNotNone(resp.payday)

    def test_payday_emperor(self, mock_countries, mock_areas):
        world, countries, curr = self._set_up()
        countries[2].conquers = 1
        countries[1].shields -= 1

        resp = game.end_turn(world, curr, countries)

        # check calls
        mock_areas.set_decrement_exhaust.assert_called()
        mock_areas.list_empty.assert_called()
        mock_countries.set_pop.assert_called()
        mock_countries.set_payday.assert_called()

        self.assertEqual(len(resp.eliminated), 0)
        self.assertEqual(len(resp.killed), 0)

        self.assertEqual(resp.emperor, 'P3')
        self.assertIsNotNone(resp.payday)

    def test_not_your_turn_fail(self, mock_countries, mock_areas):
        world, countries, curr = self._set_up()
        curr = countries[1]

        with self.assertRaises(TurnException) as context:
            resp = game.end_turn(world, curr, countries)
        self.assertEqual(context.exception.reason, 'not_your_turn')

    def test_few_players_fail(self, mock_countries, mock_areas):
        world = World(current='P1')
        countries = [
            Country(iso='P1', gold=0, pop=0, shields=7, conquers=0)
        ]
        curr = countries[0]

        with self.assertRaises(TurnException) as context:
            resp = game.end_turn(world, curr, countries)
        self.assertEqual(context.exception.reason, 'small_party')

    def test_elimination(self, mock_countries, mock_areas):
        pass

    def test_end_game(self, mock_countries, mock_areas):
        pass
