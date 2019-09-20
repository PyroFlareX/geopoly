import heapq

from game.entities import Country
from game.instance import countries


def fetch_conquers(world, countries_list):
    # apply shield changes
    shield_changes = countries.calculate_shields(world.wid, commit=False)

    # determine if we had a top conqueror
    conquered = lambda c: shield_changes.get(c.iso, (None, 0))[1]
    best, runnerup = heapq.nlargest(2, countries_list, key=conquered)

    if conquered(best) > 0:
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

            return (True, best, ex_emperor)
        else:
            return (True, None, None)

    else:
        # no payday
        return (None, None, None)


def list_eliminated_players(world, d_countries):
    still_playing = countries.list_still_playing(world.wid)
    eliminated = set(d_countries.keys()) - set(still_playing)

    winner = None

    if len(still_playing) <= 1:
        if len(still_playing) == 1:
            winner = still_playing[0]
        else:
            # the game ended, but there's no winner
            winner = '-1'

    return eliminated, winner
