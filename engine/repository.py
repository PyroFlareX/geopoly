from sqlalchemy import func, desc
from sqlalchemy.orm import Session


class Entity(object):
    def __init__(self, type):
        self.type = type

    def __call__(self, cls):
        class Wrapped(cls):
            T = self.type

        return Wrapped


class Repository:
    def __init__(self, db_session):
        self.session: Session = db_session
        self.T = None

    def count(self):
        return self.session.query(self.T).count()

    def get(self, eid):
        return self.session.query(self.T).get(eid)

    def get_all(self):
        return self.session.query(self.T).all()

    def save(self, ent):
        self.session.add(ent)
        self.session.commit()

    def save_all(self, ents):
        for ent in ents:
            self.session.add(ent)
        self.session.commit()

    def create(self, ent):
        self.session.add(ent)
        self.session.commit()

    def delete(self, ent):
        self.session.delete(ent)
        self.session.commit()

    def delete_all(self):
        self.session.query(self.T).delete()
        self.session.commit()
