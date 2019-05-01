import json
import time
import os


from flask import render_template, request, Response



class HomeController():
    def __init__(self, server):
        self.server = server
        self.group = "Home"

    def index(self):

        return render_template('/home/index.html', err=request.args.get('err'))

    def post_save(self):
        geojson = request.form['geojson']

        now = time.time()

        if os.path.isfile('GeoEditor/public/geojson/map_combined.geojson'):
            os.rename('GeoEditor/public/geojson/map_combined.geojson', 'GeoEditor/public/geojson/backup/{}.geojson'.format(now))

        with open('GeoEditor/public/geojson/map_combined.geojson', 'w') as fh:
            json.dump(geojson, fh)

        return '{}'
