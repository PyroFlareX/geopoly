import re
from collections import OrderedDict, defaultdict
from random import random

import faker

iso2locale = {
    "HU": "hu_HU"
}

fakers = {}


def create_name(iso):
    if iso not in fakers:
        fakers[iso] = faker.Faker(iso2locale[iso])
    fake = fakers[iso]

    name = fake.name_male()
    name = re.sub('([a-zA-Z]*\.)', '', name)


    if iso == 'HU':
        return medievalize(name)
    else:
        return name


def medievalize(name):
    mapper = OrderedDict({
        'sz': 'ʒ',
        'Sz': 'ʒ',
        'cs ': 'ch ',
        'ggy': 'gg',
        'gy': 'g',
        'Gy': 'g',
        'Ű': 'W',
        'ü': 'w',
        'ő': 'w',
        'Ő': 'w',
        'aly': 'ł',
        'ely': 'ł',

        'J': 'I',
        'á': 'a',
        'é': 'e',
        'ó': 'o',
        '  ': ' ',
    })
    mapper.update({
        'cs': 'ſ',
        'ly': 'l',
        'z': 'ʒ',
        'Z': 'ʒ',
        's': 'ſ',
        'S': 'ſ',
    })

    for c,to in mapper.items():
        name = name.replace(c, to)

    name = list(name)
    for pos, char in enumerate(name):
        if char == 'k' and random() > 0.4: name[pos] = 'c'
        elif char == 'j': name[pos] = 'i'
        elif char == 'i' and random() > 0.7: name[pos] = 'ý'
        elif char == 'ű':
            if random() > 0.8: name[pos] = 'ou'
            else: name[pos] = 'u'

    if name[0] == ' ': name = name[1:]
    if name[-1] == ' ': name = name[:-1]

    return ''.join(name)
