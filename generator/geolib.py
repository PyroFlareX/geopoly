from math import log, tan, pi, exp, atan


def gps2merc(lon, lat):
    x = lon * 20037508.34 / 180
    y = log(tan((90 + lat) * pi / 360)) / (pi / 180)
    y = y * 20037508.34 / 180

    return x,y


def merc2gps(x, y):
    lon = (x * 180) / 20037508.34
    lly = (y * 180) / 20037508.34
    lat = (atan(exp(lly * (pi / 180)))*360)/pi - 90

    return lon, lat
