from flask import render_template, request


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
           debug=True,
           err=request.args.get('err')
        )

    def test(self):
        ws_address = self.server.conf['websocket']['address']

        return render_template('/client/test.html',
           ws_address=ws_address,
           debug=True,
           err=request.args.get('err')
        )
