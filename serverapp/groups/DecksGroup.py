from core.managers.DeckManager import DeckManager


class DecksGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Decks'
        self.deckManager = DeckManager()

    def load(self, user):

        ldecks = self.deckManager.list(user.uid, raw=True)

        return {
            "decks": ldecks
        }