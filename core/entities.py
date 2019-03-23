from enum import Enum


class Player():

    def __init__(self, **kwargs):
        self.iso = kwargs.get('iso')
        self.mid = kwargs.get('mid')


class User(Player):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.uid = kwargs.get('uid')
        self.username = kwargs.get('username')

    def toView(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "iso": self.iso,
            "mid": self.mid,
        }

class Match(Player):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.mid = kwargs.get('mid')

        # Settings
        self.max_players = kwargs.get('max_players')
        self.max_rounds = kwargs.get('max_rounds')
        self.map = kwargs.get('map')

        # In-game
        self.turns = kwargs.get('turns')
        self.rounds = kwargs.get('rounds')
        self.current = kwargs.get('current')
        self.isos = kwargs.get('isos')

        # Not saved in DB
        self.round_iter = kwargs.get('round_iter')

    def toView(self):
        return {
            "mid": self.mid,

            "max_players": self.max_players,
            "max_rounds": self.max_rounds,
            "map": self.map,

            "isos": list(self.isos),
            "start": self.isos[0],
            "current": self.current,

            "turns": self.turns,
            "rounds": self.rounds
        }


class TurnType(Enum):
    ROUND = 0
    EMPEROR_FIRST = 1  # as in Medwars


class Area():
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
