import uuid

from sqlalchemy import Column, Integer, String, Boolean, SmallInteger
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base

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

    elo = Column(SmallInteger)
    division = Column(SmallInteger)

    def __init__(self, **kwargs):
        self.uid = kwargs.get('uid')

        self.email = kwargs.get('email')
        self.username = kwargs.get('username')
        self.iso = kwargs.get('iso')
        self.wid = kwargs.get('wid')

        self.salt = kwargs.get('salt')
        self.token = kwargs.get('token')
        self.password = kwargs.get('password')

        self.elo = kwargs.get('elo')
        self.division = kwargs.get('division')

    def to_dict(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "iso": self.iso,
            "wid": self.wid,

            "elo": self.elo,
            "division": self.division,
        }


class World(Base):
    __tablename__ = 'worlds'

    # Worlds module
    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(20))
    map = Column(String(20))
    max_players = Column(SmallInteger)

    # Turns module
    turn_time = Column(SmallInteger)
    turns = Column(SmallInteger)
    rounds = Column(SmallInteger)
    current = Column(SmallInteger)
    max_rounds = Column(SmallInteger)

    def __init__(self, **kwargs):
        super().__init__()

        self.wid = kwargs.get('wid')
        self.name = kwargs.get('name')
        self.map = kwargs.get('map')
        self.max_players = kwargs.get('max_players')
        self.turn_time = kwargs.get('turn_time')
        self.turns = kwargs.get('turns', 0)
        self.rounds = kwargs.get('rounds', 0)
        self.current = kwargs.get('current')
        self.max_rounds = kwargs.get('max_rounds')

    def to_dict(self):
        return {
            "wid": self.wid,
            "name": self.name,
            "map": self.map,
            "max_players": self.max_players,
            "turn_time": self.turn_time,
            "turns": self.turns,
            "rounds": self.rounds,
            "current": self.current,
            "max_rounds": self.max_rounds,
        }


class Area(Base):
    __tablename__ = 'areas'

    id = Column(String(8), primary_key=True)
    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True)
    iso = Column(String(5))

    exhaust = Column(SmallInteger)

    unit = Column(String(3))
    build = Column(String(6))
    tile = Column(String(6))

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.wid = kwargs.get('wid')
        self.iso = kwargs.get('iso')

        self.exhaust = kwargs.get('exhaust')

        self.build = kwargs.get('build')
        self.tile = kwargs.get('tile')
        self.unit = kwargs.get('unit')

    def to_dict(self):
        return {
            "id": self.id,
            "iso": self.iso,
            "wid": self.wid,

            "exhaust": self.exhaust,

            "build": self.build,
            "tile": self.tile,
            "unit": self.unit,
        }


class Country(Base):
    __tablename__ = 'countries'

    iso = Column(String(3), primary_key=True)
    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True)
    name = Column(String(40), nullable=False)

    gold = Column(SmallInteger, nullable=False)
    pop = Column(SmallInteger, nullable=False)
    order = Column(SmallInteger, nullable=False)
    ai = Column(SmallInteger)
    color = Column(String(7))

    emperor = Column(Boolean, default=True, nullable=False)
    shields = Column(SmallInteger, nullable=False)
    conquers = Column(SmallInteger, nullable=False)

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')

        self.iso = kwargs.get('iso')
        self.name = kwargs.get('name')
        self.wid = kwargs.get('wid')
        self.gold = kwargs.get('gold', 0)
        self.pop = kwargs.get('pop', 0)
        self.order = kwargs.get('order', 0)
        self.ai = kwargs.get('ai', 0)
        self.color = kwargs.get('color', "black")

        self.emperor = kwargs.get('emperor', False)
        self.shields = kwargs.get('shields', 0)
        self.conquers = kwargs.get('conquers', 0)

    def to_dict(self):
        return {
            "iso": self.iso,
            "name": self.name,
            "wid": self.wid,
            "gold": self.gold,
            "pop": self.pop,
            "order": self.order,
            "color": self.color,
            "ai": self.ai,

            "emperor": self.emperor,
            "shields": self.shields,
            "conquers": self.conquers,
        }
