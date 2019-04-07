from core.factories import create_default_decks, create_default_deck
from core.instance import decks


class DeckManager:

    def list(self, uid, raw=False):
        ldecks = decks.get_all(uid, raw=raw)

        if not ldecks:
            ldecks = create_default_decks(raw=raw)

        return ldecks

    def get(self, uid, did, raw=False):
        deck = decks.get(uid, did, raw=raw)

        if not deck:
            deck = create_default_deck(did, raw=raw)

        return deck
