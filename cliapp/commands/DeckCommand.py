from sqlalchemy import text

#from core.dal.ctx import session
from core.factories import create_default_deck
from core.rules import getUnits, getEffectivePoint


class DeckCommand():
    def __init__(self, cli):
        self.commands = {
            'deck:count': {
                'help': 'Counts deck points',
                'short': {'n': 'name='},
                'long': ['name=']
            }
        }

    def runCount(self, name):

        deck = create_default_deck(name)

        mup = 3950
        mep = 426933.75
        tep = 0

        for u, unit, num in getUnits(deck):
            up = unit['points'] * num
            ep = getEffectivePoint(u) * num
            tep += ep

            print("  - {:12} {:6} {:6} {:6}".format( u, up, ep, round(up/mup,3), round(ep/mep,3) ))

        print("{} count: {}".format(name, tep))