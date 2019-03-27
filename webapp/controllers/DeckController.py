from flask import render_template, request

from core.rules import units
from webapp.entities import ApiResponse


class DeckController():
    def __init__(self, server):
        self.server = server
        self.group = "Deck"

    def index(self):
        ws_address = self.server.conf['websocket']['address']

        ldecks = decks.get()

        return render_template('/deck/index.html',
           ws_address=ws_address,
           debug=True,
           err=request.args.get('err')
        )

    def units(self):
        return ApiResponse(units)
