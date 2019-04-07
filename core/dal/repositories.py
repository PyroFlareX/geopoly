from sqlalchemy.orm import Session

from core.entities import User


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
