import json
import math
from collections import defaultdict
from itertools import product

from eme.entities import EntityPatch
from shapely.speedups._speedups import numpy as np

from core import rules


#rules.units
from core.entities import Area, Unit
from core.rules import getUnits, getMilPop, UNITS, load_csv_as_dict, units_conf

mapping = defaultdict(lambda: float)
mapping.update({"__ID__": "prof"})
dmg = load_csv_as_dict('dmg', mapping=mapping)


special = {}
for prof,conf in units_conf.items():
    special[conf['special']] = prof
special = EntityPatch(special)


def getDmg(a,b):
    return dmg[str(a)][str(b)]


def cmp(a,b):
    a = round(a, 2)
    b = round(b, 2)
    return (a > b) - (a < b)


def getCasualties(fr_str, to_str, fr_total):
    to_rel_str_diff = min(3, to_str / fr_str)

    fr_pCas = getPCas(to_rel_str_diff)

    fr_cas = min(round(fr_pCas * fr_total), fr_total)

    return fr_cas


def calculateCasualties(area: Area, total_cas: int):
    losses = defaultdict(lambda: 0)

    i = 0

    while total_cas > 0:
        i += 1

        scaler = 1
        if i > 15: scaler = 5
        elif i > 10: scaler = 3
        elif i > 5: scaler = 2

        for u, unit, num in getUnits(area):
            if num <= 0:
                # these units are already annihilated
                continue

            # get number of casualties by loss frequency
            cas_step = round(max(min(total_cas * unit['loss_freq'] * scaler, num), 1))

            losses[u] += cas_step
            total_cas -= cas_step

            setattr(area, u, num - cas_step)

    return losses


def getEffectivePoint(unit):
    uu = dmg[str(unit.prof)].copy()

    EP = sum(uu.values()) / len(uu)

    # apply extra boosters:
    if special.ranged == unit.prof: EP *= 2
    elif special.dharok == unit.prof: EP *= 1.5
    elif special.booster == unit.prof: EP *= 1.25

    return EP


def apply_damage(units_fr, fr_dmg):
    dead_fr = []

    for unit in units_fr:
        unit.health -= min(unit.health, fr_dmg)

        if unit.health == 0:
            # unit died
            dead_fr.append(unit.id)

        if fr_dmg < 1:
            break

    return dead_fr


def simulate_battle(area_fr, area_to, units_fr, units_to, make_report=True):
    unit_fr: Unit; unit_to: Unit
    is_siege = area_to.castle > 0

    # sort units by their effective points
    units_fr.sort(key=getEffectivePoint)
    units_to.sort(key=getEffectivePoint)

    fr_str = 0; to_str = 0

    report = {
        "is_siege": is_siege,
        "fr_str": {
            "berserk": 0,
            "boosted": 0,

            "total": 0,
        },
        "to_str": {
            "berserk": 0,
            "boosted": 0,

            "archers_wall": 0,
            "defensive": 0,
            "defenders": 0,

            "total": 0,
        }
    }

    for unit_fr, unit_to in product(units_fr, units_to):
        fr_dmg = getDmg(unit_fr.prof, unit_to.prof)
        to_dmg = getDmg(unit_to.prof, unit_fr.prof)

        # defenders' strength only works in defensive siege
        if special.defender == unit_to.prof:
            if not is_siege:
                to_dmg = 1 if unit_fr.prof in (2,3) else 2
            else:
                report['to_str']['defenders'] += to_dmg / len(units_to)
        # attacker's defenders are always useless:
        if special.defender == unit_fr.prof:
            to_dmg = 1 if unit_fr.prof in (2,3) else 2

        # siege archers gain extra dmg
        if is_siege and special.ranged == unit_to.prof:
            report['to_str']['archers_wall'] += to_dmg / len(units_to)
            to_dmg *= 2.00

        # barbar boost:
        if not is_siege:
            if special.dharok == unit_to.prof:
                if unit_to.health < 25: to_dmg *= 2
                elif unit_to.health < 50: to_dmg *= 1.5
                report['to_str']['berserk'] += to_dmg / len(units_to)

            if special.dharok == unit_fr.prof:
                if unit_fr.health < 25: fr_dmg *= 2
                elif unit_fr.health < 50: fr_dmg *= 1.5
                report['fr_str']['berserk'] += to_dmg / len(units_fr)

        fr_str += fr_dmg
        to_str += to_dmg


    # get specials for attacker
    fr_booster = 0; fr_siege = 0
    for unit_fr in units_fr:
        if special.booster == unit_fr.prof: fr_booster += 1
        if special.siege == unit_fr.prof: fr_siege += 1

    # get specials for defender
    to_booster = 0
    for unit_to in units_to:
        if special.booster == unit_to.prof: to_booster += 1


    # apply global boosters:
    if fr_booster:
        report['fr_str']['booster'] = fr_str*0.10 / len(units_to)
        fr_str *= 1.10
    if to_booster:
        report['to_str']['booster'] = to_str*0.10 / len(units_to)
        to_str *= 1.10

    if is_siege:
        report['to_str']['defensive'] = to_str*0.15 / len(units_to)
        to_str *= 1.15

    # todo: apply siege damage
    if fr_siege:
        pass

    # normalize str points:
    fr_str /= len(units_to)
    to_str /= len(units_fr)
    report['to_str']['total'] = to_str
    report['fr_str']['total'] = fr_str


    # check if attacker wins
    winner = cmp(fr_str, to_str)

    # calculate relative and absolute losses
    fr_dmg = getPCas(to_str/fr_str) * len(units_fr) * 100
    to_dmg = getPCas(fr_str/to_str) * len(units_to) * 100

    # calculate casualties health
    dead_fr = apply_damage(units_fr, fr_dmg)
    dead_to = apply_damage(units_to, to_dmg)

    return report, (dead_fr, dead_to)

    # then apply floating damage as hp intake from next unit

    # todo: apply hero respawn if in list of death

    #if make_report:
    #    return fr_win, report(fr_total, fr_str, fr_loss), report(to_total, to_str, to_loss)

def getDefPoint(defenders: Area):
    dp = 0

    for uid, unit, num in getUnits(defenders):
        dp += num * unit['def']

    return dp

def getAttPoint(units, unitsDef: Area):


    # percentages of enemy units
    weight_classes = {
        'inf': 0, 'cav': 0, 'art': 0
    }
    weight_total = 0.000001

    # get enemy unit type percentages, weighted by their effective points
    for unit in unitsAgainst:

        uclass = uid[:3]
        weight = num * getEffectivePoint(uid)

        weight_classes[uclass] += weight
        weight_total += weight

    # get distribution of enemy unit classes
    p_inf = weight_classes['inf'] / weight_total
    p_cav = weight_classes['cav'] / weight_total
    p_art = weight_classes['art'] / weight_total

    ap = 0

    # calculate our strength based on enemy percentages
    for uid, unit, num in getUnits(units):
        ap += p_inf * unit['atk_i'] * num
        ap += p_cav * unit['atk_c'] * num
        ap += p_art * unit['atk_a'] * num

    return ap


def getPCas(x):
    """
    Gets suffered casualty

    :param x: strength difference between the two parties
    :return: casualty, in per cent
    """
    if x < 0.25:
        x = 0.25
    coeff0 = -3.3787977002884051e-002
    coeff1 = 1.5423744298612210e-001
    coeff2 = 6.9606841743195008e-002

    return min(1, abs(coeff2 * (x ** 2) + coeff1 * x + coeff0))

def getPCas2(x):
    """
    Gets suffered casualty

    :param x: strength difference between the two parties
    :return: casualty, in per cent
    """

    if x < 0:
        raise Exception("GetPCas: x can't be lower than 0")
        #return -getPCas(-x)
    if x > 3: x = 3
    if x < 0.25: x = 0.25
    #coeff0 = -3.3787977002884051e-002
    #coeff1 = 1.5423744298612210e-001
    #coeff2 = 6.9606841743195008e-002
    coeff0 = -0.015
    coeff1 = 0.06
    coeff2 = 0.02

    return min(1, abs(coeff2 * (x ** 2) + coeff1 * x + coeff0))
