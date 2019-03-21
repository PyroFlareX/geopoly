from core.entities import Match
from core.services import turns


class GameEndException(Exception):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return str(self.reason)


def end_turn(match: Match, iso: str):
    if iso != match.current:
        return False

    prev_iso = match.current
    next_iso = turns.next_turn(match)

    if next_iso == -1:
        # Match has ended by time
        raise GameEndException('out_of_rounds')

    if next_iso is None:
        # round starts over again

        turns.reset_round(match)

    if match.current == prev_iso or len(match.isos) < 2:
        raise GameEndException('one_player_left')

    return True
