from flask import render_template, request
from werkzeug.utils import redirect

from engine.modules.worlds import service
from game.instance import worlds, users
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"

    def index(self):
        #ws_address = self.server.conf['websocket']['address']
        user = getUser()

        if user.uid == 'None':
            raise Exception("hifga i eeeeeeeeeeeeeeeeeeeee")

        if not user.wid:
            return redirect('/client/welcome')

        return render_template('/client/index.html',
            #ws_address=ws_address,
            debug=True,
            err=request.args.get('err')
        )

    def load(self):
        user = getUser()

        world = worlds.get(user.wid)

        return ApiResponse({
            "world": world.to_dict()
        })

    def welcome(self):
        user = getUser()

        return render_template('/client/welcome.html',
            debug=True,
            err=request.args.get('err')
        )

    def new(self):
        """creates fake match"""

        user = getUser()
        if user.wid:
            return redirect('/')

        world = worlds.get_first()
        if not world:
            world = service.create(name="Test")

        service.join(user, world, "UK")

        users.set_world(user.uid, world.wid, user.iso)
        worlds.save(world)

        return redirect('/')

