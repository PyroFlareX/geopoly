from core import settings
from core.entities import Match, TurnType
from core.instance import matches


def create_match():
    """
    Creates an empty match for matchmaking
    """

    match = Match()

    # todo: these come from settings
    match.max_players = int(settings.get('match.max_players'))
    match.max_rounds = int(settings.get('match.max_rounds'))
    match.turn_type = TurnType.EMPEROR_FIRST

    match.map = 1

    # match.turns = 0
    # match.rounds = 0
    # match.current = 0
    # match.pids = []

    return match
