import json

with open('engine/content/modules.json') as fh:
    loaded_modules = json.load(fh)['modules']
