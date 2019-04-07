from django.shortcuts import redirect
from flask import render_template, request

from core.services import claim
from webapp.entities import ApiResponse
from webapp.services.login import getUser, setUser


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

    def post_join(self):

        mid = request.form['mid']
        iso = request.form['iso']
        username = request.form['username']

        user = getUser()

        claim.set_match(user, mid, iso, username)

        setUser(user)

        return ApiResponse({

        })
