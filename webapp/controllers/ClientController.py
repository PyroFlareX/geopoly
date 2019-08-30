from eme.entities import loadConfig
from flask import render_template, request
from werkzeug.utils import redirect

from engine import settings
from engine.modules.worlds import service
from game.instance import worlds, users
from webapp.services.login import getUser


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"

    def index(self):
        user = getUser()

        if user.uid == 'None':
            raise Exception("hifga i eeeeeeeeeeeeeeeeeeeee")

        if not user.wid:
            return redirect('/client/welcome')
        world = worlds.get(user.wid)

        return render_template('/client/index.html',
            conf=settings._conf,
            world=world,
            err=request.args.get('err')
        )

    def welcome(self):
        user = getUser()

        return render_template('/client/welcome.html',
            debug=True,
            err=request.args.get('err')
        )
