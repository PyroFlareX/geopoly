import heapq

from engine.modules.turns.service import TurnBox

from game.entities import World, User, Country
from game.instance import countries as db_countries, areas as db_areas
from game.services.conquering import fetch_conquers, list_eliminated_players
from game.views import RoundEventsView


class TurnException(Exception):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return str(self.reason)


class EndGameException(Exception):
    def __init__(self, reason, events):
        self.reason = reason
        self.events = events

    def __str__(self):
        return str(self.reason)


def end_turn(world: World, curr: Country, countries: dict):
    """
    :param world: game world
    :param curr: the country that ends the turn
    :param countries: all countries in the world, in order of turn
    :return:
    """

    if world.current != curr.iso:
        raise TurnException("not_your_turn")

    if len(countries) <= 1:
        raise TurnException("small_party")

    tb = TurnBox(world, list(countries.keys()))

    next_iso = tb.next()
    while countries.get(next_iso) is not None and countries[next_iso].shields <= 0:
        # skip over eliminated countries (but keep the turn number)
        next_iso = tb.next()
        world.turns -= 1

    if next_iso == curr.iso:
        raise TurnException("small_party")

    world.has_moved = False

    if next_iso is None:
        # round ends, restart turn
        resp = _end_round(world, countries, tb)

        if resp.emperor:
            # new round starts counting from the new emperor
            tb.start(resp.emperor.iso)
            isos = tb.current_playerIds()

            # reassign country orders  based on tb isos:
            for country in countries.values():
                country.order = isos.index(country.iso)

        else:
            # otherwise, we continue as usual
            tb.start()

            # order & isos list stays as before.

        resp.isos = tb.current_playerIds()

        return resp

    return None


def _end_round(world, d_countries, tb):
    events = RoundEventsView()

    # re-calculate pop difference
    pops = db_countries.calculate_pop(world.wid, commit=False)

    # check elimination condition
    events.wid = world.wid
    events.round = world.rounds

    events.eliminated, winner = list_eliminated_players(world, d_countries)

    # Calculate conquers done in the round and assign new emperor & payday:
    has_payday, events.emperor, events.ex_emperor = fetch_conquers(world, d_countries.values())

    if has_payday:
        # at least one player conquered, so we have payday
        events.payday = db_countries.calculate_payday(world.wid, commit=False)

    # reset areas
    db_areas.set_decrement_exhaust(world.wid, commit=False)
    db_areas.set_reset_iso2(world.wid, commit=False)

    # commit all changes at once
    db_countries.session.commit()


    # check end game condition
    if winner:
        raise EndGameException(winner, events)

    return events
