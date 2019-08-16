import random

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


def calculate_elo(eloA, eloB, sA, numA=0, numB=0):
    expA = get_expected(eloA, eloB)
    expB = 1 - expA

    Ka = get_K(eloA, numA)
    Kb = get_K(eloB, numB)

    sB = 1 - sA

    eloA += Ka*(sA - expA)
    eloB += Kb*(sB - expB)

    if eloA < 700: eloA = 700
    if eloB < 700: eloB = 700

    return eloA, eloB

divisions = [
    'silver1', 'silver2', 'silver_elite',
    'gold1', 'gold2',
    'major', 'colonel', 'general', 'marshal'
]
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
