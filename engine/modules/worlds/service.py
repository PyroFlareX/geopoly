from engine import settings
from engine.core import loaded_modules
from game.entities import World


def create(**kwargs):
    world = World(**kwargs)

    if world.max_players is None:
        world.max_players = settings.get('worlds.max_players', int, 0)

    if 'turns' in loaded_modules:
        world.max_rounds = settings.get('worlds.max_rounds', int, 0)
        world.turn_time = settings.get('worlds.turn_time', int, 0)

    return world


def join(user, world, iso):
    if user.wid:
        return False

    # todo: itt: ISO ellenorzes!

    user.wid = world.wid
    user.iso = iso

    return True
