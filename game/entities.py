import datetime
import uuid

from sqlalchemy import Column, Integer, String, Boolean, SmallInteger, ForeignKey, ForeignKeyConstraint, Date, DateTime
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    uid = Column(postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(Integer, nullable=True)

    iso = Column(String(3))
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

        # data conversion
        if isinstance(self.wid, str):
            self.wid = uuid.UUID(self.wid)
        if isinstance(self.uid, str):
            self.uid = uuid.UUID(self.uid)

    def to_dict(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "iso": self.iso,
            "wid": str(self.wid) if self.wid else None,

            "elo": self.elo,
            "division": self.division,
        }

    def __repr__(self):
        return "{}({})".format(self.iso, self.username)


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
    current = Column(String(3))
    max_rounds = Column(SmallInteger)

    has_moved = Column(Boolean, nullable=False, default=False)

    countries = relationship("Country", cascade="delete")
    areas = relationship("Area", cascade="delete")

    def __init__(self, **kwargs):
        super().__init__()

        self.wid = kwargs.get('wid')
        self.name = kwargs.get('name')
        self.map = kwargs.get('map')
        self.has_moved = kwargs.get('has_moved')
        self.max_players = kwargs.get('max_players')
        self.turn_time = kwargs.get('turn_time')
        self.turns = kwargs.get('turns', 0)
        self.rounds = kwargs.get('rounds', 0)
        self.current = kwargs.get('current')
        self.max_rounds = kwargs.get('max_rounds')

        if isinstance(self.wid, str):
            self.wid = uuid.UUID(self.wid)

    def to_dict(self):
        return {
            "wid": str(self.wid),
            "name": self.name,
            "map": self.map,
            "max_players": self.max_players,
            "has_moved": self.has_moved,
            "turn_time": self.turn_time,
            "turns": self.turns,
            "rounds": self.rounds,
            "current": self.current,
            "max_rounds": self.max_rounds,
        }


class Country(Base):
    __tablename__ = 'countries'

    iso = Column(String(3), primary_key=True)
    wid = Column(postgresql.UUID(as_uuid=True), ForeignKey(World.wid), primary_key=True)
    name = Column(String(40), nullable=False)

    gold = Column(SmallInteger, nullable=False)
    pop = Column(SmallInteger, nullable=False)
    order = Column(SmallInteger, nullable=False)
    ai = Column(Boolean, default=False, nullable=False)
    color = Column(String(7))

    emperor = Column(Boolean, default=True, nullable=False)
    shields = Column(SmallInteger, nullable=False)
    conquers = Column(SmallInteger, nullable=False)

    areas = relationship("Area")

    world = relationship("World", back_populates="countries")


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

        if isinstance(self.wid, str):
            self.wid = uuid.UUID(self.wid)

    def to_dict(self):
        return {
            "iso": self.iso,
            "name": self.name,
            "wid": str(self.wid),
            "gold": self.gold,
            "pop": self.pop,
            "order": self.order,
            "color": self.color,
            "ai": self.ai,

            "emperor": self.emperor,
            "shields": self.shields,
            "conquers": self.conquers,
        }


class Area(Base):
    __tablename__ = 'areas'

    id = Column(String(8), primary_key=True)
    wid = Column(postgresql.UUID(as_uuid=True), ForeignKey(World.wid), primary_key=True)
    iso = Column(String(3))
    iso2 = Column(String(3), nullable=True)

    exhaust = Column(SmallInteger)

    unit = Column(String(3))
    build = Column(String(6))
    tile = Column(String(6))

    country = relationship("Country", back_populates="areas")
    world = relationship("World", back_populates="areas")

    __table_args__ = (ForeignKeyConstraint((iso, wid), [Country.iso, Country.wid]), {})

    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.wid = kwargs.get('wid')
        self.iso = kwargs.get('iso')
        self.iso2 = kwargs.get('iso2')

        self.exhaust = kwargs.get('exhaust')

        self.build = kwargs.get('build')
        self.tile = kwargs.get('tile')
        self.unit = kwargs.get('unit')

        if isinstance(self.wid, str):
            self.wid = uuid.UUID(self.wid)

    def to_dict(self):
        return {
            "id": self.id,
            "iso": self.iso,
            "iso2": self.iso2,
            "wid": str(self.wid),

            "exhaust": self.exhaust,

            "build": self.build,
            "tile": self.tile,
            "unit": self.unit,
        }

    def __repr__(self):
        ff = []
        if self.iso: ff.append(self.iso)
        else: ff.append('')

        if self.build:
            ff.append(self.build)
        elif self.tile:
            ff.append(self.tile)
        elif self.unit:
            ff.append('')
            ff.append(self.unit)
        else:
            pass

        return "{}({})".format(self.id, ','.join(ff))


class MatchHistory(Base):
    __tablename__ = 'histories'

    wid = Column(postgresql.UUID(as_uuid=True), primary_key=True)
    map = Column(String(20))
    rounds = Column(SmallInteger)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    results = relationship("MatchResult")

    def __init__(self, **kwargs):
        self.wid = kwargs.get('wid')

        self.map = kwargs.get('map', 0)
        self.rounds = kwargs.get('rounds', 0)
        self.created_at = kwargs.get('created_at')

    def to_dict(self):
        return {
            "wid": self.wid,
            "map": self.map,
            "rounds": self.rounds,
            "created_at": self.created_at,
        }


class MatchResult(Base):
    __tablename__ = 'histories_users'
    id = Column(postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ForeignKey(User.uid),
    history_id = Column(postgresql.UUID(as_uuid=True), ForeignKey(MatchHistory.wid), default=uuid.uuid4)
    uid = Column(postgresql.UUID(as_uuid=True), default=uuid.uuid4, nullable=True)

    iso = Column(String(3))
    div = Column(SmallInteger)
    order = Column(SmallInteger)

    result = Column(SmallInteger)
    shields = Column(SmallInteger)
    areas = Column(SmallInteger)
    cities = Column(SmallInteger)
    gold = Column(SmallInteger)
    inf = Column(SmallInteger)
    cav = Column(SmallInteger)
    art = Column(SmallInteger)
    barr = Column(SmallInteger)
    house = Column(SmallInteger)
    cita = Column(SmallInteger)

    # todo @later:
    #kills = Column(SmallInteger)
    #deaths = Column(SmallInteger)
    #captures = Column(SmallInteger)
    #losses = Column(SmallInteger)
    #gold_spent = Column(SmallInteger)
    #pop_sum = Column(SmallInteger)

    # history = relationship("MatchHistory", back_populates="results")

    def __init__(self, **kwargs):
        self.history_id = kwargs.get('history_id')
        self.uid = kwargs.get('uid')

        self.div = kwargs.get('div')
        self.iso = kwargs.get('iso')
        self.order = kwargs.get('order')
        self.result = kwargs.get('result')

        self.areas = kwargs.get('areas', 0)
        self.cities = kwargs.get('cities', 0)
        self.shields = kwargs.get('shields', 0)
        self.gold = kwargs.get('gold', 0)
        self.inf = kwargs.get('inf', 0)
        self.cav = kwargs.get('cav', 0)
        self.art = kwargs.get('art', 0)
        self.barr = kwargs.get('barr', 0)
        self.house = kwargs.get('house', 0)
        self.cita = kwargs.get('cita', 0)

    def to_dict(self):
        return {
            "history_id": self.history_id,
            "uid": self.uid,
            "div": self.div,
            "iso": self.iso,
            "order": self.order,
            "result": self.result,
            "shields": self.shields,
            "gold": self.gold,
            "areas": self.areas,
            "cities": self.cities,
            "inf": self.inf,
            "cav": self.cav,
            "art": self.art,
            "barr": self.barr,
            "house": self.house,
            "cita": self.cita,
        }

