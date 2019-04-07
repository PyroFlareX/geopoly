from core.entities import Area, Deck, User, Match
from core.exceptions import JoinException
from core.rules import getUnits


def add_units(area: Area, deck: Deck, iso: str):
    if area.iso is not None:
        raise JoinException("area_not_available")

    area.iso = iso

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

    set_match(user, match.mid, iso, username)

    match.isos.append(iso)

def set_match(user: User, mid, iso, username):
    user.mid = mid
    user.iso = iso
    user.username = username

def leave_match(match, user):
    if not user.iso and not user.mid:
        raise JoinException("not_joined")

    if user.iso in match.isos:
        match.isos.remove(user.ido)

    user.mid = None
    user.iso = None
    user.username = None
