from flask import render_template

from webapp.services.login import getUser


class MatchesController():
    def __init__(self, server):
        self.server = server
        self.group = "Matches"


    def index(self):
        ws_address = self.server.conf['websocket']['address']

        getUser()

        return render_template('/matches/index.html',
           ws_address=ws_address,
           debug=True
        )

