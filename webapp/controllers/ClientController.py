from flask import render_template, request
from werkzeug.utils import redirect

from webapp.entities import ApiResponse
from webapp.services.login import getUser


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"

    def index(self):
        #ws_address = self.server.conf['websocket']['address']
        user = getUser()

        if not user.wid:
            return redirect('/client/welcome')

        return render_template('/client/index.html',
            #ws_address=ws_address,
            debug=True,
            err=request.args.get('err')
        )

    def new(self):
        """Creation of a new user"""

        user = getUser()
        if user.wid:
            return redirect('/')

        return render_template('/client/new.html',
            debug=True,
            err=request.args.get('err')
        )

    def welcome(self):
        user = getUser()

        return render_template('/client/welcome.html',
            debug=True,
            err=request.args.get('err')
        )
