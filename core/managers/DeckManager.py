from core.entities import Deck
from core.factories import create_default_decks, create_default_deck
from core.instance import decks
from core.rules import UNITS


class DeckManager:

    def list(self, uid, raw=False):
        ldecks = decks.get_all(uid, raw=raw)

        if not ldecks:
            ldecks = create_default_decks(raw=raw)

        return ldecks

    def get(self, uid, did, raw=False):
        deck = decks.get(did, raw=raw)

        if not deck:
            deck = create_default_deck(did, raw=raw)

        return deck

    def delete(self, uid, did):
        deck = decks.get(did)

        decks.delete(deck)

    def create(self, uid, name, patch):
        deck = Deck(uid=uid, name=name)

        for u in UNITS:
            setattr(deck, u, patch[u])

        decks.create(deck)
