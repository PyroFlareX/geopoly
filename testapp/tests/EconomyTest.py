import unittest

from engine.modules.building.service import BuyException
from game.entities import Country, Area
from game.services import economy


class EconomyTest(unittest.TestCase):

    def test_pay_tribute(self):
        country1 = Country(iso='FR', gold=100)
        country2 = Country(iso='UK', gold=100)
        amount = 30

        economy.give_tribute(country1, country2, amount)

        self.assertEqual(country1.gold, 70)
        self.assertEqual(country2.gold, 130)

    def test_pesto_notcity_fail(self):
        country = Country(iso='UK', gold=0, pop=0, shields=2)

        area = Area(iso='UK')

        with self.assertRaises(BuyException) as context:
            economy.sacrifice_shield(country, area, 'art')

        self.assertEqual(context.exception.reason, 'missing_city')
        self.assertIsNone(area.unit)

    def test_pesto_sacrifice(self):
        country = Country(iso='UK', gold=20, pop=0, shields=2)

        area = Area(iso='UK', tile='city')

        economy.sacrifice_shield(country, area, 'cav')

        self.assertEqual(country.gold, 20)
        self.assertEqual(country.pop, 0)
        self.assertEqual(area.unit, 'cav')
