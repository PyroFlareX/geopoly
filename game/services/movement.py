from collections import defaultdict

from game.entities import Area, Country
from engine.modules.geomap import service as map_serv
from engine.modules.building.service import items
from game.instance import areas


class MoveException(Exception):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return str(self.reason)


def _check_move(area1: Area, area2: Area):
    # move rules
    if area1.id == area2.id or not area1.unit:
        #  or not area1.iso == playerId
        raise MoveException('invalid_params')
    if area1.exhaust:
        # unit is exhausted. it needs more turns
        raise MoveException('cant_move_more')

    conf = items[area1.unit]

    if area2.unit:
        # attack
        if area2.iso == area1.iso:
            # can't attack self
            raise MoveException('not_enemy')

        if area2.tile == 'forest' and area1.unit == 'cav':
            # Cavalry can't attack into forest
            raise MoveException('cant_attack_cavalry')

        if not map_serv.is_connected(area1.id, area2.id, top_depth=conf['attack_range']):
            # invalid move with range
            raise MoveException('cant_attack_there')

    else:
        # simple move
        if not map_serv.is_connected(area1.id, area2.id, top_depth=conf['move_range']):
            # invalid move with range
            raise MoveException('cant_move_there')

    return True


def move_to(area1: Area, area2: Area, map_name=None):
    map_serv.switch_conn_graph(map_name)

    # raises MoveException
    _check_move(area1, area2)

    is_cannon_fire = area1.unit == 'art' and bool(area2.unit)
    is_conquer = area2.tile == 'city' and area2.iso != area1.iso

    # unit is killed
    area2.unit = None
    area2.exhaust = 1

    # cannons do not move position when they attack
    if not is_cannon_fire:
        # move to empty area
        area2.iso = area1.iso
        area2.unit = area1.unit
        area1.unit = None

    if area2.tile:
        # exhaust unit, can't move next round
        conf = items[area2.tile]
        area2.exhaust = conf.get('exhaust', 1)

    if is_conquer:
        # conquer area
        area2.iso = area1.iso

    return is_conquer


def move_bulk(area_moves_dict):
    """
    This is useful for when the client caches all moves and only sends them in 1 batch
    :param area1_list:
    :param area2_list:
    """

    if len(area_moves_dict) > 50:
        raise MoveException(130)

    area1_list = areas.list(area_moves_dict.keys())
    area2_list = areas.list(area_moves_dict.values())
    area2_dict = {area.id: area for area in area2_list}
    del area2_list

    conquer_dict = defaultdict(int)

    for area1 in area1_list:
        area2 = area2_dict[area_moves_dict[area1.id]]

        is_conquer = move_to(area1, area2, world.map)

        if is_conquer:
            conquer_dict[area1.iso] += 1
            conquer_dict[area2.iso] -= 1

    return conquer_dict

