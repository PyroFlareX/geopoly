from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from core.entities import User, Unit, Area, World, Respawn


class UserRepository():

    def __init__(self, db_session):
        self.session: Session = db_session


    def get(self, uid=None, email=None, username=None, code=None):

        if uid is not None:
            user = self.session.query(User).get(uid)
        elif username is not None:
            user = self.session.query(User).filter(User.username == username).first()
        elif email is not None:
            user = self.session.query(User).filter(User.email == email).first()
        elif code is not None:
            user = self.session.query(User).filter(User.forgot_code == code).first()
        else:
            user = None

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

    def save_world(self, user: User):
        self.session.query(User).update({User.wid: user.wid, User.iso: user.iso})
        self.session.commit()


class WorldRepository:
    def __init__(self, db_session):
        self.session: Session = db_session

    def count(self):
        return self.session.query(World).count()

    def get(self, wid):
        world: World = self.session.query(World).get(wid)

        return world

    def list_all(self):
        worlds = self.session.query(World).all()

        return worlds

    def create(self, world: World):
        self.session.add(world)
        self.session.commit()

    def save(self, world: World):
        self.session.add(world)
        self.session.commit()

    def delete(self, world: World):
        self.session.delete(world)
        self.session.commit()


class AreaRepository:
    def __init__(self, db_session):
        self.session: Session = db_session

    def count(self):
        return self.session.query(Area).count()

    def get(self, aid, wid):
        area: Area = self.session.query(Area).get([aid, wid])

        return area

    def list(self, area_ids, wid, as_dict=False):
        areas = self.session.query(Area).filter(Area.wid == wid).filter(Area.id.in_(area_ids)).all()

        if not as_dict:
            return areas

        return {area.id: area for area in areas}

    def list_by_player(self, pid):
        #area: Area = self.session.query(Area).filter(Area.pid == pid).all()
        area: Area = self.session.query(Area).all()

        return area

    def list_all(self, wid, as_dict=False):
        areas = self.session.query(Area).filter(Area.wid == wid).all()

        if not as_dict:
            return areas

        return {area.id: area for area in areas}

    def list_castle_virgin_by_iso(self, iso, wid):
        """
        Lists areas that are:
            - virgin
            - are castles
            - match iso and wid
        """
        areas = self.session.query(Area)\
            .filter(Area.wid == wid)\
            .filter(Area.iso == iso)\
            .filter(Area.virgin.is_(True))\
            .filter(Area.castle > 0)\
            .order_by(desc(Area.castle))\
        .all()

        return areas

    def create(self, area: Area):
        self.session.add(area)
        self.session.commit()

    def save(self, area: Area):
        self.session.add(area)
        self.session.commit()

    def save_all(self, areas):
        for area in areas:
            self.session.add(area)
        self.session.commit()

    def delete(self, area: Area):
        self.session.delete(area)
        self.session.commit()


class UnitRepository:

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, did):
        deck: Unit = self.session.query(Unit).get(did)

        return deck

    def list(self, unit_ids, wid, as_dict=False):
        units = self.session.query(Unit).filter(Unit.wid == wid).filter(Unit.id.in_(unit_ids)).all()

        if not as_dict:
            return units

        return {unit.id: unit for unit in units}

    def list_by_area(self, area_id, wid):
        units = self.session.query(Unit).filter(Unit.wid == wid).filter(Unit.aid == area_id).all()

        return units

    def list_by_player(self, pid):
        units = self.session.query(Unit).filter(Unit.pid == pid).all()

        return units

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



class RespawnRepository:

    def __init__(self, db_session):
        self.session: Session = db_session

    def get(self, did):
        respawn: Respawn = self.session.query(Respawn).get(did)

        return respawn

    def create(self, respawn: Respawn):
        self.session.add(respawn)
        self.session.commit()

    def save(self, respawn: Respawn):
        self.session.add(respawn)
        self.session.commit()

    def save_all(self, respawns):
        for respawn in respawns:
            self.session.add(respawn)
        self.session.commit()

    def delete(self, respawn: Respawn):
        self.session.delete(respawn)
        self.session.commit()

    def delete_all(self):
        self.session.query(Respawn).delete()
        self.session.commit()
