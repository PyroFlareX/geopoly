"""Main entry point of game"""
import heapq

from engine.modules.turns.service import TurnBox

from game.entities import World, User, Country
from game.instance import countries as db_countries, areas as db_areas
from game.views import RoundEventsView


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
    events = RoundEventsView()

    # re-calculate pop difference
    pops = db_countries.calculate_pop(world.wid)

    # apply shield changes
    shield_changes = db_countries.calculate_shields(world.wid)

    # check elimination condition
    events.wid = world.wid
    events.round = world.rounds
    still_playing = db_countries.list_still_playing(world.wid)
    events.eliminated = set(isos) - set(still_playing)

    # check end game condition
    if len(still_playing) <= 1:
        # todo: @later
        print("TODO: check end game")

    # determine if we had a top conqueror
    conquered = lambda c: shield_changes[c.iso][1]
    best, runnerup = heapq.nlargest(2, countries, key=conquered)

    if conquered(best) > 0:
        # at least one player conquered, so we have payday
        events.payday = db_countries.calculate_payday(world.wid)

        if conquered(best) > conquered(runnerup):
            # there is no tie in the number of conquers
            # the frontrunner becomes the emperor.
            ex_emperor: Country = next(filter(lambda c: c.emperor, countries))

            ex_emperor.emperor = False
            best.emperor = True
            best.gold += 20
            events.ex_emperor = ex_emperor
            events.emperor = best

            # new turn starts from the new emperor!
            tb.start(best.iso)

    # reset areas
    db_areas.set_decrement_exhaust(world.wid)
    db_areas.set_reset_iso2(world.wid)

    # Update countries' model with DB changes
    # (in case the calling method wants to use the country objects)
    # for country in countries:
    #     if country.iso != best.iso:
    #         country.emperor = False
    #
    #     # update loaded entity models (we're not saving these here, though):
    #     country.gold += events.payday[country.iso]
    #     country.pop = pops[country.iso]
    #     country.conquers += conquered(country)


    return events
