import uuid
from enum import Enum

from eme.entities import EntityPatch
from sqlalchemy import Column, Float, ForeignKey, Integer, String, Boolean, SmallInteger, JSON
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property

Base = declarative_base()


Skins = {
    0: (1,),
    4: (2,9),
    3: (3,5),
    1: (4,),
    6: (6,),
    7: (7,),
    2: (8,10),

    10: (21,22,23,24,25,26),

    8: (11,),
    5: (12,),
    11: (13,),
    9: (14,),
}

unit_names = {
  0: "FOOT",
  4: "ARCHER",
  3: "KNIGHT",
  1: "PIKE",
  6: "BARD",
  7: "BARBAR",
  2: "LIGHTCAV",
  10: "HERO",
  8: "THUG",
  5: "CATA",
  11: "DEFENDER",
  9: "STRONG",
}


class User(Base):
    __tablename__ = 'users'

    uid = Column(postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(Integer, nullable=True)

    iso = Column(String(5))
    wid = Column(postgresql.UUID(as_uuid=True))

    username = Column(String(32))
    email = Column(String(128))
    salt = Column(String(128), nullable=True)
    token = Column(String(128), nullable=True)
    password = Column(String(128))


    def __init__(self, **kwargs):
        self.uid = kwargs.get('uid')

        self.email = kwargs.get('email')
        self.username = kwargs.get('username')
        self.iso = kwargs.get('iso')
        self.wid = kwargs.get('wid')

        self.salt = kwargs.get('salt')
        self.token = kwargs.get('token')
        self.password = kwargs.get('password')

    def toView(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "iso": self.iso,
            "wid": self.wid,
        }


class World(Base):
    __tablename__ = 'worlds'

    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    max_players = Column(SmallInteger)
    turn_time = Column(SmallInteger)
    turns = Column(SmallInteger)

    def __init__(self, **kwargs):
        super().__init__()

        self.wid = kwargs.get('wid')

        self.max_players = kwargs.get('max_players')
        self.turn_time = kwargs.get('turn_time')
        self.turns = kwargs.get('turns')

        #self.events = kwargs.get('events', [])

    def toView(self):
        return {
            "wid": self.wid,
            "max_players": self.max_players,
            "turns": self.turns,
            "turn_time": self.turn_time,
            #"events": self.events
        }


class Area(Base):
    __tablename__ = 'areas'

    id = Column(String(8), primary_key=True)
    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True)

    pid = Column(postgresql.UUID(as_uuid=True))
    iso = Column(String(5))

    castle = Column(SmallInteger)
    virgin = Column(SmallInteger)
    training = Column(SmallInteger)
    train_left = Column(SmallInteger)

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')

        self.iso = kwargs.get('iso')
        self.pid = kwargs.get('pid')
        self.wid = kwargs.get('wid')

        # lvl of castle, if any
        self.castle = kwargs.get('castle', 0)
        # is area untouched (can be claimed)
        self.virgin = kwargs.get('virgin', 0)

        # type of unit in training
        self.training = kwargs.get('training')
        # turns left till new unit is trained
        self.train_left = kwargs.get('train_left')

    def toDict(self):
        return {
            "id": self.id,
            "iso": self.iso,
            "pid": self.pid,
            "wid": self.wid,
            "castle": self.castle,
            "virgin": self.virgin,

            "training": self.training,
            "train_left": self.train_left,
        }


class Unit(Base):
    __tablename__ = 'units'

    id = Column(Integer, primary_key=True)
    aid = Column(String(8))
    pid = Column(postgresql.UUID(as_uuid=True))
    wid = Column(postgresql.UUID(as_uuid=True))
    iso = Column(String(5))

    prof = Column(SmallInteger)
    skin = Column(SmallInteger)

    age = Column(Float)
    name = Column(String(30))
    img_vector = Column(postgresql.JSON)

    move_left = Column(SmallInteger)
    health = Column(SmallInteger)
    xp = Column(SmallInteger)

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.iso = kwargs.get('iso')
        self.wid = kwargs.get('wid')
        self.pid = kwargs.get('pid')
        self.aid = kwargs.get('aid')
        self.iso = kwargs.get('iso')

        self.prof = kwargs.get('prof')
        self.skin = kwargs.get('skin')

        self.name = kwargs.get('name')
        self.age = kwargs.get('age')
        self.img_vector = kwargs.get('img_vector')

        self.move_left = kwargs.get('move_left')
        self.health = kwargs.get('health')
        self.xp = kwargs.get('xp')

    def toDict(self):
        # fixme dirty hack, return normal dict
        d = self.__dict__.copy()

        if '_sa_instance_state' in d:
            d.pop('_sa_instance_state')

        return d

    def toView(self):
        return self.toDict()

    def clone(self):
        return Unit(**self.toDict())

    def __repr__(self):
        return '{} ({})'.format(self.name, unit_names[self.prof])


class Respawn(Base):
    __tablename__ = 'respawns'

    id = Column(Integer, primary_key=True, autoincrement=True)
    prof = Column(SmallInteger, nullable=True)
    aid = Column(SmallInteger)
    train_left = Column(SmallInteger)

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.prof = kwargs.get('prof')
        self.aid = kwargs.get('aid')
        self.train_left = kwargs.get('train_left')
