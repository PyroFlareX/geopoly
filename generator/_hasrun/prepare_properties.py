import sys
import json
import codecs


def prepare_properties():
  isos = ['UK','PT','ES','AT', 'NL', 'BE', 'SE', 'DK', 'RU', 'TR', 'DE','FR','CH']
  ger = ["WU","BA","PR","HA","SX","HZ","KL"]
  ita = ["NP","PA","TU","PS","VE","MA","GE"]

  with codecs.open('areas_original.geojson', encoding='utf8') as fh:
      areasGEOJSON = json.load(fh)

  for area in areasGEOJSON['features']:
      prop = area['properties'].copy()

      iso = prop['CNTR_CODE']

      if iso in ger:
        iso = 'DE'
      elif iso in ita:
        iso = 'IT'
      elif iso not in isos:
        iso = None

      area['properties'] = {
        "iso": iso,
        "name": prop['NUTS_NAME']
      }

  with codecs.open('areas.geojson', 'w', encoding='utf8') as fh:
      json.dump(areasGEOJSON, fh, separators=(',', ':'))


if __name__ == "__main__":

    prepare_properties()
