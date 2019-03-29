from sqlalchemy.orm import Session

from core.entities import User


class UserRepository():

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, uid = None):
        user: User = self.session.query(User).get(uid)

        return user
