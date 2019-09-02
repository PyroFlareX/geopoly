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
        resp = _end_round(world, countries.values(), countries, tb)

        if resp.emperor:
            # new round starts counting from the new emperor
            tb.start(resp.emperor.iso)
        else:
            # otherwise, we continue as usual
            tb.start()


        return resp

    return None


def _end_round(world, countries_list, isos, tb):
    events = RoundEventsView()

    # re-calculate pop difference
    pops = db_countries.calculate_pop(world.wid, commit=False)

    # apply shield changes
    shield_changes = db_countries.calculate_shields(world.wid, commit=False)

    # check elimination condition
    events.wid = world.wid
    events.round = world.rounds
    still_playing = db_countries.list_still_playing(world.wid)
    events.eliminated = set(isos) - set(still_playing)

    # determine if we had a top conqueror
    conquered = lambda c: shield_changes.get(c.iso, (None, 0))[1]
    best, runnerup = heapq.nlargest(2, countries_list, key=conquered)

    if conquered(best) > 0:
        # at least one player conquered, so we have payday
        events.payday = db_countries.calculate_payday(world.wid, commit=False)

        if conquered(best) > conquered(runnerup):
            # there is no tie in the number of conquers
            # the frontrunner becomes the emperor.
            try:
                ex_emperor: Country = next(filter(lambda c: c.emperor, countries_list))
                ex_emperor.emperor = False
            except StopIteration:
                # there was no ex emperor
                ex_emperor = None

            best.emperor = True
            best.gold += 20
            events.ex_emperor = ex_emperor
            events.emperor = best

            # new turn starts from the new emperor!
            tb.start(best.iso)

    # reset areas
    db_areas.set_decrement_exhaust(world.wid, commit=False)
    db_areas.set_reset_iso2(world.wid, commit=False)

    # commit all changes at once
    db_countries.session.commit()

    # Update countries' model with DB changes
    # (in case the calling method wants to use the country objects)
    # for country in countries_list:
    #     # update loaded entity models (we're not saving these here, though):
    #     #country.gold += events.payday.get(country.iso, 1)
    #     #country.pop = pops[country.iso]
    #
    #     sh_loss, sh_gain = shield_changes.get(country.iso, (0, 0))
    #     country.shields += sh_gain
    #     country.shields -= sh_loss
    #
    #     # this is done in the controller instead:
    #     # if country.iso in events.eliminated:
    #     #     country.shields = 0
    #
    #     #country.conquers += conquered(country)

    # check end game condition
    if len(still_playing) <= 1:
        if len(still_playing) == 1:
            raise EndGameException(still_playing[0], events)
        else:
            raise EndGameException('-1', events)

    return events
