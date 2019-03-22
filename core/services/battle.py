from collections import defaultdict

from core import rules


#rules.units
from core.entities import Area
from core.rules import getUnits, getEffectivePoint, getMilPop


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


def report(total, str, loss):
    return {
        'mils': total,
        'strength': round(str),
        'loss': dict(loss)
    }


def calculateBattle(area_fr, area_to, make_report=True):
    fr_attp = getAttPoint(area_fr, area_to)
    to_attp = getAttPoint(area_to, area_fr)
    to_defp = getDefPoint(area_to)

    # calculate total strength points
    fr_str = fr_attp
    to_str = to_attp + to_defp

    # check if attacker wins
    fr_win = fr_str > to_str

    # mil pop
    fr_total = getMilPop(area_fr)
    to_total = getMilPop(area_to)

    # calculate relative and absolute losses
    fr_cas = getCasualties(fr_str, to_str, fr_total)
    to_cas = getCasualties(to_str, fr_str, to_total)

    # calculate rate of deaths, based on defs multiplied by enemy weights
    # todo: itt
    fr_loss = calculateCasualties(area_fr, fr_cas)
    to_loss = calculateCasualties(area_to, to_cas)

    if make_report:
        return fr_win, report(fr_total, fr_str, fr_loss), report(to_total, to_str, to_loss)

def getDefPoint(defenders: Area):
    dp = 0

    for uid, unit, num in getUnits(defenders):
        dp += num * unit['def']

    return dp

def getAttPoint(units: Area, unitsAgainst: Area):
    # percentages of enemy units
    weight_classes = {
        'inf': 0, 'cav': 0, 'art': 0
    }
    weight_total = 0.000001

    # get enemy unit type percentages, weighted by their effective points
    for uid, unit, num in getUnits(unitsAgainst):
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
