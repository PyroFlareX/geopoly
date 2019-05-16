import json
from collections import defaultdict
from random import choice

#from core.entities import Area, Match
from core.instance import areas, units
from core.rules import getUnits, getMilPop
from core.services.areas import is_path_connected


def bulk_move_to(unit_ids, wid, path, pid):
    # validate path
    if not is_path_connected(path):
        return False

    lunits = units.list(unit_ids, wid)
    iso = lunits[0].iso
    from_id = path[0]
    to_id = path[-1]

    area = areas.get(to_id, wid)
    nunits = units.list_by_area(area.id, wid)
    is_castle = area.castle > 0
    is_conquer = False
    was_conquered = False

    # check if this is a friendly or enemy move
    if not is_conquer:
        for nunit in units:
            if nunit.iso != iso or nunit.pid != pid:
                # we can't merge with friendly units
                return False

        # check if area is not occupied
        total_len = len(nunits) + len(lunits)
        if (is_castle and total_len > 18) or (not is_castle and total_len > 9):
            return False
    else:
        if len(nunits) > 0:
            # this is a battle.
            print("TODO: battle")
            # todo: later: battle
            return False

        if len(nunits) == 0:
            # conquer empty area
            area.iso = iso
            area.pid = pid

            was_conquered = True

    path_len = len(path)

    for unit in lunits:
        # validate move
        if unit.aid != from_id or unit.iso != iso or unit.pid != pid or unit.wid != wid:
            # naughtly little player trying to manipulate someone else's units
            return False

        if unit.move_left < path_len:
            # this unit can't move anymore
            return False

        # set unit move
        unit.aid = to_id
        unit.move_left -= path_len

    # finalize movement:
    units.save_all(lunits)

    if is_conquer and was_conquered:
        # area has been captured, so save it
        areas.save(area)

    return True
