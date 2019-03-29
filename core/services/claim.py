from core.entities import Area, Deck, User, Match
from core.exceptions import JoinException
from core.rules import getUnits


def add_units(area: Area, deck: Deck):
    if area.iso is not None:
        raise JoinException("area_not_available")

    for u, unit, num in getUnits(deck):
        setattr(area, u, num)


def join_match(match: Match, iso, user: User, username):
    if (user.iso or user.mid) and user.iso != iso:
        raise JoinException("already_joined")

    if iso in match.isos:
        raise JoinException("country_not_available")

    if len(match.isos) >= match.max_players:
        raise JoinException("match_full")

    if match.rounds >= 0.3 * match.max_rounds:
        raise JoinException("not_in_time")

    user.mid = match.mid
    user.iso = iso
    user.username = username

    match.isos.append(iso)
