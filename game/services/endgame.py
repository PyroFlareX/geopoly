

"""

- : all values are set to -1
    (check shields by convention)
- elimination of a player: => 0 cities and 0 units
-
"""
from game.instance import countries, worlds, areas, users


def check_endgame(world):
    in_game_isos = countries.list_still_playing(world.wid)

    winner = None

    if len(in_game_isos) <= 1:
        # game has ended
        if len(in_game_isos) == 1:
            # a winner has been declared
            winner = in_game_isos[0]

        # todo: ranked (?)

        # todo: create match history

        # todo: delete whole world

    return winner


def finalize_world(world, winner, players):

    for player in players:
        if winner.uid == player.uid:
            # todo: ranking + rewards
            # set winner
            pass
        else:
            # todo: ranking + rewards
            pass
    print("TODO: ranking & rewards")

