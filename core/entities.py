from enum import Enum

from sqlalchemy import Column, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.dialects import postgresql
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    uid = Column(postgresql.UUID(as_uuid=True), primary_key=True)

    username = Column(String(32))
    iso = Column(String(5))
    mid = Column(postgresql.UUID(as_uuid=True))

    #email = Column(String(128))
    #salt = Column(String(128), nullable=True)
    #token = Column(String(128), nullable=True)
    #password = Column(String(128))
    #created_at = Column(Integer)

    def __init__(self, **kwargs):
        self.uid = kwargs.get('uid')
        #self.email = kwargs.get('email')

        self.username = kwargs.get('username')
        self.iso = kwargs.get('iso')
        self.mid = kwargs.get('mid')

    def toView(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "iso": self.iso,
            "mid": self.mid,
        }


class Match:

    def __init__(self, **kwargs):
        super().__init__()

        self.mid = kwargs.get('mid')

        # Settings
        self.max_players = kwargs.get('max_players')
        self.max_rounds = kwargs.get('max_rounds')
        self.map = kwargs.get('map')

        # In-game
        self.turns = kwargs.get('turns')
        self.rounds = kwargs.get('rounds')
        self.current = kwargs.get('current')
        self.isos = kwargs.get('isos', [])

        self.events = kwargs.get('events', [])

        # Not saved in DB
        self.round_iter = kwargs.get('round_iter')

    def toView(self):
        return {
            "mid": self.mid,

            "max_players": self.max_players,
            "max_rounds": self.max_rounds,
            "map": self.map,

            "isos": list(self.isos),
            "start": self.isos[0] if len(self.isos) > 0 else None,
            "current": self.current,

            "turns": self.turns,
            "rounds": self.rounds,

            "events": self.events
        }


class TurnType(Enum):
    ROUND = 0
    EMPEROR_FIRST = 1  # as in Medwars


class Area:
    def __init__(self, **kwargs):
        self.id = kwargs.get('id')
        self.iso = kwargs.get('iso')
        self.mid = kwargs.get('mid')

        self.inf_light = kwargs.get('inf_light', 0)
        self.inf_home = kwargs.get('inf_home', 0)
        self.inf_heavy = kwargs.get('inf_heavy', 0)
        self.inf_skirmish = kwargs.get('inf_skirmish', 0)

        self.cav_lancer = kwargs.get('cav_lancer', 0)
        self.cav_hussar = kwargs.get('cav_hussar', 0)
        self.cav_dragoon = kwargs.get('cav_dragoon', 0)
        self.cav_heavy = kwargs.get('cav_heavy', 0)

        self.art_light = kwargs.get('art_light', 0)
        self.art_heavy = kwargs.get('art_heavy', 0)
        self.art_mortar = kwargs.get('art_mortar', 0)

        # percentage of movement from current round
        self.move_left = kwargs.get('move_left', 0)

    def toView(self):
        return self.__dict__

    def toUnitView(self):
        return {
            "inf_light": self.inf_light,
            "inf_home": self.inf_home,
            "inf_heavy": self.inf_heavy,
            "inf_skirmish": self.inf_skirmish,
            "cav_lancer": self.cav_lancer,
            "cav_hussar": self.cav_hussar,
            "cav_dragoon": self.cav_dragoon,
            "cav_heavy": self.cav_heavy,
            "art_light": self.art_light,
            "art_heavy": self.art_heavy,
            "art_mortar": self.art_mortar,
        }


class Deck:
    def __init__(self, **kwargs):
        self.did = kwargs.get('did')
        self.uid = kwargs.get('uid')
        self.name = kwargs.get('name')

        self.inf_light = kwargs.get('inf_light', 0)
        self.inf_home = kwargs.get('inf_home', 0)
        self.inf_heavy = kwargs.get('inf_heavy', 0)
        self.inf_skirmish = kwargs.get('inf_skirmish', 0)

        self.cav_lancer = kwargs.get('cav_lancer', 0)
        self.cav_hussar = kwargs.get('cav_hussar', 0)
        self.cav_dragoon = kwargs.get('cav_dragoon', 0)
        self.cav_heavy = kwargs.get('cav_heavy', 0)

        self.art_light = kwargs.get('art_light', 0)
        self.art_heavy = kwargs.get('art_heavy', 0)
        self.art_mortar = kwargs.get('art_mortar', 0)

    def toView(self):
        return self.__dict__
