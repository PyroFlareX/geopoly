import json
from collections import defaultdict
from random import choice

#from core.entities import Area, Match
from core.instance import units
from core.rules import getUnits, getMilPop
from core.services import areas
from core.services.areas import is_path_connected


def bulk_move_to(unit_ids, wid, path, pid):
    # validate path
    if not is_path_connected(path):
        return False

    my_units = units.list(unit_ids, wid)
    iso = my_units[0].iso
    from_id = path[0]
    to_id = path[-1]

    area = areas.load_area(to_id, wid)
    if not area:
        #print()
        raise Exception("  Area not found: {} in world {}".format(to_id, wid))

    op_units = units.list_by_area(area.id, wid)
    is_castle = area.castle > 0
    is_conquer = False
    was_conquered = False

    # check if this is a friendly or enemy move
    if not is_conquer:
        for nunit in op_units:
            if nunit.iso != iso or nunit.pid != pid:
                # we can't merge with some ally's units
                return False

        # check if area is not occupied
        total_len = len(op_units) + len(my_units)
        if (is_castle and total_len > 18) or (not is_castle and total_len > 9):
            return False
    else:
        if len(op_units) > 0:
            # this is a battle.
            print("TODO: battle")
            # todo: later: battle
            return False

        if len(op_units) == 0:
            # conquer empty area
            area.iso = iso
            area.pid = pid

            was_conquered = True

    path_len = len(path)

    for unit in my_units:
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
    units.save_all(my_units)

    if is_conquer and was_conquered:
        # area has been captured, so save it
        areas.save(area)

    return True
