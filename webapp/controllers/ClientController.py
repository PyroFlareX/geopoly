from flask import render_template, request
from werkzeug.utils import redirect

from engine.modules.worlds import service
from game.instance import worlds, users
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
        world = worlds.get(user.wid)

        return render_template('/client/index.html',
            #ws_address=ws_address,
            world=world,
            debug=True,
            err=request.args.get('err')
        )

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

