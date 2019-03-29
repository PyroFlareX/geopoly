from core.factories import create_default_decks, create_default_deck
from core.instance import decks


class DeckManager:

    def list(self, uid, raw=False):
        if uid == 'guest':
            return create_default_decks(raw=raw)

        return decks.get_all(uid, raw=raw)

    def get(self, uid, did, raw=False):
        if uid == 'guest':
            return create_default_deck(did, raw=raw)

        return decks.get(uid, did, raw=raw)
