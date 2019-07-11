import json
from collections import defaultdict
from random import choice

#from core.entities import Area, Match
from core.exceptions import GuardedAreaException
from core.instance import units, areas
from core.rules import getUnits, getMilPop
from core.services.areas import is_path_connected, is_connected, are_neighbors


def bulk_move_to(myunits, area, wid=None, from_area=None, op_units=None, is_attack=False):
    # fetch redundant info, if it's not provided
    if wid is None:
        wid = myunits[0].wid

    # load entities if they're not provided:
    if from_area is None:
        aid = myunits[0].aid
        from_area = areas.get()

    if op_units is None:
        op_units = units.list_by_area(area.id, wid)

    iso = myunits[0].iso
    to_iso = area.iso # to_iso = op_units[0].iso

    # validate path
    is_friendly_move = iso == to_iso and is_connected(from_area.id, area.id)
    is_conquer_move = iso != to_iso and are_neighbors(from_area.id, area.id)
    is_occupied = len(op_units) > 0

    if not is_friendly_move and not is_conquer_move:
        return False

    # todo: itt: move vaze


def bulk_move_path(myunits, area_ids, wid):
    raise Exception("NOT_IMPLEMENTED")

    #return None
