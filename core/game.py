from eme.entities import EntityPatch

from core.entities import Match, Area
from core.exceptions import AreaGuardedException, MoveException, GameEndException
from core.instance import areas
from core.rules import getUnits, getMilPop, UNITS, getAreaEP
from core.services import turns, moves, battle


def end_turn(match: Match, iso: str):
    if iso != match.current:
        return False

    prev_iso = match.current
    next_iso = turns.next_turn(match)

    if next_iso == -1:
        # Match has ended by time
        raise GameEndException('out_of_rounds')

    if next_iso is None:
        print("New round #{}".format(match.rounds))
        # round starts over again
        turns.reset_round(match)

        # reset exhaustion
        moves.reset_map(match, save=True)

        print(1)

    if match.current == prev_iso or len(match.isos) < 2:
        raise GameEndException('one_player_left')

    return True


def move_to(area_from: Area, area_to: Area, patch: dict):

    if not moves.is_connected(area_from.id, area_to.id):
        raise MoveException("not_neighbor")

    # check if user has already moved from that area
    if area_from.move_left <= 0:
        raise MoveException("has_moved")

    num_sum = 0

    for u, unit, num_from, num_to in getUnits(area_from, area_to):
        num_move = patch.get(u, 0)

        if num_move > num_from:
            # Error in user input for number of units
            raise MoveException("not_enough_units")

        if num_to > 0 and area_to.iso != area_from.iso:
            # Area is guarded, and it's not yours, you can't just conquer it without a little fight
            raise AreaGuardedException()

        # If everything is correct, move the units
        num_sum += num_move

        setattr(area_from, u, num_from - num_move)
        setattr(area_to, u, num_to + num_move)

    if area_from.move_left < num_sum:
        raise MoveException("has_moved")

    if num_sum == 0:
        raise MoveException("bad_input")

    # Conquer area
    if area_to.iso != area_from.iso:
        area_to.iso = area_from.iso

    # exhaust area
    area_from.move_left -= num_sum
    area_to.move_left = 0

    return True


def attack_to(area_from: Area, area_to: Area, patch: dict):

    att_win, rep_from, rep_to = battle.calculate_battle(area_from, area_to, patch)

    escape_patch = None
    new_patch = None

    # move to area after battle
    if att_win:

        if getMilPop(area_to) > 0:
            # let defending army escape, if they still have some men left
            # if def_survived = False, it means that they were defeated by encirclement
            def_survived = defender_escape(area_to, area_from.id)
        else:
            # defender was defeated in battle
            def_survived = False

        new_patch = moves.normalize_patch(area_from, patch)

        move_to(area_from, area_to, new_patch)
    else:
        # defender won
        def_survived = True

    return new_patch, escape_patch, EntityPatch({
        "att_win": att_win,
        "def_survived": def_survived,

        "rep_from": rep_from,
        "rep_to": rep_to
    })

def defender_escape(area_to, attacker_id):
    escape_patch = area_to.toUnitView()

    neighbor_ids = moves.get_neighbors(area_to.id)
    neighbor_ids.remove(attacker_id)

    neighbor_areas = list(areas.get_multiple_iso(area_to.mid, neighbor_ids, area_to.iso))

    # reset area units
    for u in UNITS:
        setattr(area_to, u, 0)

    if len(neighbor_areas) == 0:
        # annihilation by encirclement, they will not move anywhere

        return False

    # get neighbor with biggest army force
    neighbor_areas.sort(key=lambda area: getAreaEP(area), reverse=True)
    area_escape = neighbor_areas[0]

    # remaining army survived and escaped, put them into neighbor area
    for u in UNITS:
        setattr(area_escape, u, escape_patch[u])

    return True
