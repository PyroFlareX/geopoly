import random

from engine import settings
from game.entities import User


def exp_win(elo, opp_elo):
  # elo formula
  return 1 / (1+10**((opp_elo-elo)/400))


def get_expected(elo, opp_elo):
    # elo formula
    return 1 / (1+10**((opp_elo-elo)/400))


def get_K(elo, n_games):
    if n_games < 30 and elo < 2300:
        return 400
    elif elo < 2400:
        return 200
    return 100


def elo_change(eloA, eloB, sA, nA=0):
    expA = get_expected(eloA, eloB)

    Ka = 32
    return round(Ka * (sA - expA))


divisions = settings.get('rating.divisions')
MAX_DIV = divisions.index('marshal')


def handle_divisions(user: User, sa):
    if user.division >= MAX_DIV:
        # user is already at max division
        return False

    if user.elo > 1800 and sa==1:
        # user has ascended beyond promo elo
        user.division += 1
        return True

    elif user.elo < 900 and sa==0 and user.division > 0:
        # user has fallen 1 division below
        user.division -= 1
        return True
    elif user.elo < 500:
        # minimum possible elo
        user.elo = 500


def change_elos(user1: User, user2: User, numA, numB, sA):
    user1.elo, user2.elo = calculate_elo(user1.elo, user2.elo, aA, numA, numB)

    handle_divisions(user1, sA)
    handle_divisions(user2, 1-sA)
