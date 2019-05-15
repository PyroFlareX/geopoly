import re
from collections import OrderedDict, defaultdict
from random import random

import faker

iso2locale = {
    "AG": "es_ES",
    "ES": "es_ES",
    "PT": "pt_PT",
    "GR": "ar_EG",
    "SC": "",
    "IE": "",
    "UK": "en_GB",
    "FR": "fr_FR",
    "SV": "fr_FR",
    "BU": "fr_FR",
    "LO": "fr_FR",
    "PO": "fr_FR",
    "NP": "it_IT",
    "IF": "it_IT",
    "PP": "it_IT",
    "GE": "it_IT",
    "MI": "it_IT",
    "IT": "it_IT",
    "DE": "de_DE",
    "BB": "de_DE",
    "TT": "de_DE",
    "LU": "de_DE",
    "NL": "de_DE",
    "UT": "de_DE",
    "FF": "de_DE",
    "DK": "dk_DK",
    "NO": "no_NO",
    "SE": "sv_SE",
    "FI": "fi_FI",
    "LT": "lt_LT",
    "PL": "pl_PL",
    "CZ": "cs_CZ",
    "AT": "de_DE",
    "HU": "hu_HU",
    "RO": "no_NO",
    "MD": "ro_RO",
    "BG": "bg_BG",
    "RS": "",
    "TU": "tr_TR",
    "TR": "tr_TR",
    "JY": "ar_EG",
    "BY": "el_GR",
    "GO": "ka_GE",
    "RU": "ru_RU",
    "NV": "ru_RU",
    "GD": "",
    "CY": "tr_TR",
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
