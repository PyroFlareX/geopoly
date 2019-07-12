import uuid
from enum import Enum

from eme.entities import EntityPatch
from sqlalchemy import Column, Float, ForeignKey, Integer, String, Boolean, SmallInteger, JSON
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property

Base = declarative_base()


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

    def to_dict(self):
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

    def to_dict(self):
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

    iso = Column(String(5))

    building = Column(SmallInteger)

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')

        self.wid = kwargs.get('wid')
        self.iso = kwargs.get('iso')

        self.building = kwargs.get('building')

    def to_dict(self):
        return {
            "id": self.id,
            "iso": self.iso,
            "wid": self.wid,
            "building": self.building,
        }
