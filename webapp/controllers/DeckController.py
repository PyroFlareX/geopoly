from flask import render_template, request
from flask_login import login_required
from werkzeug.utils import redirect

from core.instance import decks
from core.managers.DeckManager import DeckManager
from core.rules import units
from webapp.entities import ApiResponse
from webapp.services.login import getUser


class DeckController():
    def __init__(self, server):
        self.server = server
        self.group = "Deck"

        self.deckManager = DeckManager()
        self.server.setRouting({
            'DELETE /deck': '/deck/<did>'
        })

    @login_required
    def index(self):
        ws_address = self.server.conf['websocket']['address']

        ldecks = self.deckManager.list(getUser().id, raw=True)

        return render_template('/deck/index.html',
           ws_address=ws_address,
           decks=ldecks,
           debug=True,
           err=request.args.get('err')
        )

    def units(self):
        return ApiResponse(units)

    def post(self):
        user = getUser()
        dname = request.form['name']

        self.deckManager.create(user.uid, dname, request.form.to_dict())

        #return redirect('/deck')
        return ApiResponse({})

    def delete(self, did):
        user = getUser()

        try:
            did = int(did)
        except:
            return ApiResponse({})

        self.deckManager.delete(user.uid, did)

        #return redirect('/deck')

        return ApiResponse({})
