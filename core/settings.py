from eme.entities import loadConfig


def load():
    conf = loadConfig('core/content/config.ini')

    for okey, oval in conf.items():
        for key, val in oval.items():
            if val == 'yes':
                conf[okey][key] = True
            elif val == 'no':
                conf[okey][key] = False
            elif ',' in val:
                conf[okey][key] = val.split(',')

    return conf


def get(opts, cast=None):
    if '.' not in opts:

        if cast is not None:
            return {k:cast(val) for k,val in _conf[opts].items()}
        else:
            return _conf[opts]

    main, opt = opts.split('.')

    if main not in _conf:
        return None

    val = _conf[main].get(opt)

    if opt is None:
        if cast is bool:
            return False
        elif cast is float or cast is int:
            return 0

        return None

    if cast is not None:
        return cast(val)
    return val


_conf = load()
