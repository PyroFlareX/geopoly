from flask import render_template, request, Response
import json


class HomeController():
    def __init__(self, server):
        self.server = server
        self.group = "Home"

    def index(self):

        return render_template('/home/index.html', err=request.args.get('err'))
