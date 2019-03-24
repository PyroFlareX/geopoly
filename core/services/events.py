from core.entities import Match


def addEvent(match: Match, type, iso):
    return {
        "type": type,
        "iso": iso,
        "np": len(match.isos),

        "round": match.rounds,
    }

def addBattleEvent(match: Match, type, iso, battle):
    e = addEvent(match, type, iso)

    e['battle'] = battle

def pushEvent(match: Match, event: dict):
    ME = 15

    match.events.append(event)

    if len(match.events) > ME:
        match.events.pop(0)
