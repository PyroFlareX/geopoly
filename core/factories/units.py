import json
from random import choice

import numpy as np
from numpy.random.mtrand import normal

from core.entities import Unit, Skins

from core import rules
from core.factories.names import create_name

with open('core/content/face_weights.json') as fh:
    face_weights = json.load(fh)

def create_unit(prof, iso, **kwargs):
    #conf = rules.units[prof]
    unit = Unit(iso=iso, **kwargs)

    unit.age = int(normal(35, 6))
    unit.name = create_name(iso)
    unit.prof = rules.prof2int(prof) if isinstance(prof, str) else prof
    unit.skin = choice(Skins[prof])
    unit.img_vector = np.round(np.random.uniform(face_weights['lows'], face_weights['highs'])).tolist()
    unit.iso = iso

    unit.xp = 0
    unit.health = 100
    unit.move_left = rules.units[prof]['speed']

    return unit


with open('core/content/team.json') as fh:
    start_team = json.load(fh)


def create_team(**kwargs):
    units = []

    for prof, num in start_team.items():
        for i in range(num):
            units.append(create_unit(prof=prof, **kwargs))

    return units
