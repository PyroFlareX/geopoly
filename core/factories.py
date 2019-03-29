import json
import uuid

from core import settings
from core.entities import Match, TurnType, Deck
from core.instance import matches


def create_match(map=1, max_players=None, max_rounds=None):
    """
    Creates an empty match for matchmaking
    """

    match = Match()

    if not max_players:
        match.max_players = int(settings.get('match.max_players'))
    else:
        match.max_players = max_players

    if not max_rounds:
        match.max_rounds = int(settings.get('match.max_rounds'))
    else:
        match.max_rounds = max_rounds

    match.turn_type = TurnType.EMPEROR_FIRST
    match.mid = str(uuid.uuid4())

    match.events = []
    match.map = map

    # match.turns = 0
    # match.rounds = 0
    # match.current = 0
    # match.pids = []

    return match


with open('core/content/decks.json') as fh:
    dp = json.load(fh)


def create_default_decks(raw=False):
    decktypes = ['normal', 'offensive']
    decks = []

    if raw:
        for deck_type in decktypes:
            decks.append(dp[deck_type])
    else:
        for deck_type in decktypes:
            decks.append(Deck(**dp[deck_type]))

    return decks


def create_default_deck(did, raw=False):
    if raw:
        return dp[did]
    else:
        return Deck(**dp[did])

