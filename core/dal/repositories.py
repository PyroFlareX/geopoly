from sqlalchemy.orm import Session

from core.entities import User, Deck


class UserRepository():

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, uid = None):
        user: User = self.session.query(User).get(uid)

        return user

    def delete(self, user: User):
        self.session.delete(user)
        self.session.commit()

    def create(self, user: User):
        self.session.add(user)
        self.session.commit()

    def save(self, user: User):
        self.session.add(user)
        self.session.commit()

class DeckRepository:

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, did):
        deck: Deck = self.session.query(Deck).get(did)

        return deck

    def get_all(self, uid, raw=False):
        decks = self.session.query(Deck).filter(Deck.uid == uid).all()

        if raw:
            return [deck.toView() for deck in decks]

        return decks

    def delete(self, deck: Deck):
        self.session.delete(deck)
        self.session.commit()

    def create(self, deck: Deck):
        self.session.add(deck)
        self.session.commit()

    def save(self, deck: Deck):
        self.session.add(deck)
        self.session.commit()
