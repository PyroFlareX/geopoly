from random import shuffle
from collections import deque



# todo: itt: turns
from core.entities import Match


def init(match: Match):
    if match.turns is not None:
        raise Exception("Match has already been started")

    match.turns = 1
    match.rounds = 1
    match.current = None

    # scramble list of countries
    shuffle(match.isos)
    match.isos = deque(match.isos)

    # set round to first player
    set_first_player(match, match.isos[0])


def set_first_player(match: Match, iso):
    # find first player and make it the first in isos list
    i = match.isos.index(iso)
    match.isos.rotate(-i)

    # deserialize so that we have a deque & iter
    #deserialize(match)

    # reset deque & iter
    match.round_iter = iter(match.isos)

    match.current = next(match.round_iter)


def next_turn(match: Match):
    deserialize(match)

    # Get next in round
    match.turns += 1
    try:
        match.current = next(match.round_iter)
    except StopIteration:
        # None means that there are no more people in the round
        match.current = None
        match.rounds += 1

        if match.max_rounds and match.rounds > match.max_rounds:
            # Match has ended, BYE
            match.current = -1

    except Exception as e:
        raise e

    return match.current


def reset_round(match: Match):
    deserialize(match)

    set_first_player(match, match.isos[0])


def deserialize(match: Match):
    # deserialize from DB
    if match.current is not None and match.current not in match.isos:
        raise Exception("Current player not in match.isos")

    # jump to current player
    if isinstance(match.isos, list):
        match.round_iter = iter(match.isos)
        match.isos = deque(match.isos)

        if match.current is not None:
            Ni = match.isos.index(match.current)

            # skip Ni-1 entries
            for i in range(Ni):
                next(match.round_iter)

    # ... otherwise we assume that serialization happened
