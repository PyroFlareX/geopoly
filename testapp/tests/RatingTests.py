from unittest import TestCase, mock

from game.entities import User
from game.services import rating, endgame


class RatingTests(TestCase):

    def test_unfair(self):

        users = [
            User(iso='P1', elo=1600, div=3),
            User(iso='P2', elo=1100, div=3),
            User(iso='P3', elo=1100, div=3),
            User(iso='P4', elo=1800, div=3),
        ]

        endgame.apply_rating(users, winner='P1')

        self.assertEqual(users[0].elo, 1600 + 6)

        self.assertEqual(users[1].elo, 1100 - 2)
        self.assertEqual(users[2].elo, 1100 - 2)
        self.assertEqual(users[3].elo, 1800 - 24)


    def test_equal_elo(self):

        users = [
            User(iso='P1', elo=1100, div=3),
            User(iso='P2', elo=1100, div=3),
            User(iso='P3', elo=1100, div=3),
            User(iso='P4', elo=1100, div=3),
        ]

        endgame.apply_rating(users, winner='P1')

        self.assertNotEqual(users[0].elo, users[1].elo)

        self.assertEqual(users[2].elo, users[3].elo)
        self.assertEqual(users[1].elo, users[2].elo)

    def test_unequal_elo(self):
        users = [
            User(iso='P1', elo=1100, div=3),
            User(iso='P2', elo=1090, div=3),
            User(iso='P3', elo=1100, div=3),
            User(iso='P4', elo=1100, div=3),
        ]

        endgame.apply_rating(users, winner='P1')

        self.assertNotEqual(users[0].elo, users[1].elo)

        self.assertEqual(users[2].elo, users[3].elo)
        self.assertNotEqual(users[0].elo, users[2].elo)
        self.assertNotEqual(users[1].elo, users[2].elo)
