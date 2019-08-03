"""Main entry point of game"""
import heapq

from engine.modules.turns.service import TurnBox

from game.entities import World, User, Country
from game.instance import countries as db_countries, areas as db_areas
from game.views import RoundEvents


class TurnException(Exception):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return str(self.reason)


def end_turn(world: World, curr: Country, countries):
    """
    :param world: game world
    :param curr: the country that ends the turn
    :param countries: all countries in the world, in order of turn
    :return:
    """
    isos = [country.iso for country in countries]

    if world.current != curr.iso:
        raise TurnException("not_your_turn")

    if len(isos) <= 1:
        raise TurnException("small_party")

    tb = TurnBox(world, isos)
    #tb.start()

    next_iso = tb.next()
    if next_iso == curr.iso:
        raise TurnException("small_party")

    if next_iso is None:
        # round ends
        return _end_round(world, countries, isos, tb)

    return None


def _end_round(world, countries, isos, tb):
    events = RoundEvents()

    # reset exhausts
    db_areas.set_decrement_exhaust(world.wid)

    # re-calculate pop difference
    pops = db_countries.set_pop(world.wid)

    # check elimination condition
    events.eliminated = list(filter(lambda c: c.shields == 0, countries))
    events.killed = db_areas.list_empty(world.wid)
    events.wid = world.wid
    events.round = world.rounds

    # check end game condition
    rip = set(events.eliminated + events.killed)
    if len(rip) >= len(isos) - 1:
        # todo: @later
        print("TODO: check end game")

    # determine if we had a top conqueror
    best: Country
    best, second_best = heapq.nlargest(2, countries, key=lambda c: c.conquers)

    if best.conquers > 0:
        # at least one player conquered, so we have payday
        events.payday = db_countries.set_payday(world.wid)
        for country in countries:
            country.emperor = False

            # update loaded entity models:
            country.gold += events.payday[country.iso]
            country.pop = pops[country.iso]

        # check emperor condition
        if best.conquers > second_best.conquers:
            # we have a top player in conquers, it becomes the new emperor
            best.emperor = True
            best.gold += 20
            events.emperor = best.iso

            # new turn starts from the new emperor!
            tb.start(best.iso)

    return events
