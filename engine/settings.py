import csv

from eme.entities import loadConfig


def load():
    conf = loadConfig('game/content/config.ini')

    for okey, oval in conf.items():
        for key, val in oval.items():
            if val == 'yes':
                conf[okey][key] = True
            elif val == 'no':
                conf[okey][key] = False
            elif ',' in val:
                conf[okey][key] = val.split(',')

                if conf[okey][key][-1] == '':
                    conf[okey][key] = conf[okey][key][:-1]

    return conf


def get(opts, cast=None, default=None):
    if '.' not in opts:

        if cast is not None:
            return {k:cast(val) for k,val in _conf[opts].items()}
        else:
            return _conf[opts]

    main, opt = opts.split('.')

    if main not in _conf:
        return default

    val = _conf[main].get(opt)

    if opt is None:
        if cast is bool:
            return False
        elif cast is float or cast is int:
            return 0

        return default

    if val is None:
        return default

    if cast is not None:
        return cast(val)
    return val


def load_csv(filename, mapping=None, encoding='ascii', ignore_duplicates=False):
    items = {}
    id = mapping['__ID__']
    duplicates = set()

    with open('game/content/{}.csv'.format(filename), 'r', encoding=encoding) as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in spamreader:
            if row[id] in items:
                duplicates.add(row[id])

            item = {}

            for k, v in row.items():
                if k != id:
                    item[k] = mapping.get(k, str)(v) if v else None

            items[row[id]] = item

    if not ignore_duplicates and duplicates:
        raise Exception("Duplicate found in keys {}".format(duplicates))

    return items


_conf = load()
