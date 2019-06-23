import json
from collections import defaultdict
from random import choice

#from core.entities import Area, Match
from core.exceptions import GuardedAreaException
from core.instance import units, areas
from core.rules import getUnits, getMilPop
from core.services.areas import is_path_connected, is_connected


def bulk_move_to(my_units, from_area, area, wid, pid, path=None):
    if not my_units or not from_area or not area or not wid or not pid:
        return False

    # validate path
    if not is_connected(from_area.id, area.id):
        return False

    op_units = units.list_by_area(area.id, wid)
    iso = my_units[0].iso

    is_castle = area.castle > 0
    is_in_war = True
    is_conquer = from_area.iso != area.iso and is_in_war
    was_conquered = False

    # check if this is a friendly or enemy move
    if is_conquer:
        if len(op_units) > 0:
            raise GuardedAreaException()

        if len(op_units) == 0:
            # conquer empty area
            area.iso = iso
            area.pid = pid

            was_conquered = True
    else:
        for nunit in op_units:
            if nunit.iso != iso or nunit.pid != pid:
                # we can't merge with some ally's units
                return False

        # check if area is not occupied
        total_len = len(op_units) + len(my_units)
        if (is_castle and total_len > 18) or (not is_castle and total_len > 9):
            return False

    path_len = len(path) if path else 1

    for unit in my_units:
        # validate move
        if unit.aid != from_area.id or unit.iso != iso or unit.pid != pid or unit.wid != wid:
            # naughtly little player trying to manipulate someone else's units
            return False

        if unit.move_left < path_len:
            # this unit can't move anymore
            return False

        # set unit move
        unit.aid = area.id
        unit.move_left -= path_len

    return True


def bulk_move_path(unit_ids, wid, path, pid):
    # validate path
    if not is_path_connected(path):
        return False

    my_units = units.list(unit_ids, wid)
    iso = my_units[0].iso
    from_id = path[0]
    to_id = path[-1]

    area = areas.load_area(to_id, wid)
    from_area = areas.load_area(from_id, wid)
    if not area:
        #print()
        raise Exception("  Area not found: {} in world {}".format(to_id, wid))

    #op_units = units.list_by_area(area.id, wid)

    return bulk_move_to(my_units, from_area, area, wid=wid, pid=pid, path=path)
