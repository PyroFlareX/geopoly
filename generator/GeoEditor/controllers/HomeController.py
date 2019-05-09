import json
import time
import os
import codecs


from flask import render_template, request, Response



class HomeController():
    def __init__(self, server):
        self.server = server
        self.group = "Home"

    def index(self):

        return render_template('/home/index.html', err=request.args.get('err'))

    def post_save(self):
        geojson = request.form['geojson']
        mapId = int(request.form['map'])

        now = time.time()
        path = 'GeoEditor/public/geojson/areas.geojson'.format(mapId)

        if os.path.isfile(path):
            os.rename(path, 'GeoEditor/public/geojson/backup/map{}_{}.geojson'.format(mapId, now))

        with codecs.open(path, 'w', encoding='utf8') as fh:
            fh.write(geojson)

        return '{}'
