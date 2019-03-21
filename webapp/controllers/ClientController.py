from flask import render_template, request, Response
from werkzeug.utils import redirect

from webapp.entities import ApiResponse


class ClientController():
    def __init__(self, server):
        self.server = server
        self.group = "Client"

        self.server.setRouting({
        })

    def index(self):
        ws_address = self.server.conf['websocket']['address']

        return render_template('/client/index.html',
           ws_address=ws_address,
           debug=self.server.conf['website'].get('debug', False),
           err=request.args.get('err')
        )

    def test(self):
        return render_template('/test/test.html')