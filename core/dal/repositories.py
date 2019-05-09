from sqlalchemy.orm import Session

from core.entities import User, Unit, Area


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


class UnitRepository:

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, did):
        deck: Unit = self.session.query(Unit).get(did)

        return deck

    def list_by_player(self, pid):
        units = self.session.query(Unit).filter(Unit.pid == pid).all()

        return units

    # def get_all(self, uid, raw=False):
    #     decks = self.session.query(Unit).filter(Unit.uid == uid).all()
    #
    #     if raw:
    #         return [deck.toView() for deck in decks]
    #
    #     return decks

    def create(self, unit: Unit):
        self.session.add(unit)
        self.session.commit()

    def save(self, unit: Unit):
        self.session.add(unit)
        self.session.commit()

    def save_all(self, units):
        for unit in units:
            self.session.add(unit)
        self.session.commit()

    def delete(self, unit: Unit):
        self.session.delete(unit)
        self.session.commit()

    def delete_all(self):
        self.session.query(Unit).delete()
        self.session.commit()

class AreaRepository:

    def __init__(self, db_session):
        self.session: Session = db_session

    def count(self):
        return self.session.query(Area).count()

    def get(self, did):
        area: Area = self.session.query(Area).get(did)

        return area

    def list(self, area_ids, as_dict=False):
        areas = self.session.query(Unit).filter(Area.id.in_(area_ids)).all()

        if not as_dict:
            return areas

        return {area.id: area for area in areas}

    def list_by_player(self, pid):
        #area: Area = self.session.query(Area).filter(Area.pid == pid).all()
        area: Area = self.session.query(Area).all()

        return area

    def delete(self, area: Area):
        self.session.delete(area)
        self.session.commit()

    def create(self, area: Area):
        self.session.add(area)
        self.session.commit()

    def save(self, area: Area):
        self.session.add(area)
        self.session.commit()
