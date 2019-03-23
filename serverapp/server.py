from collections import defaultdict

from eme.entities import loadConfig
from eme.websocket import WebsocketApp


class GeopolyServer(WebsocketApp):

    def __init__(self):
        conf = loadConfig('serverapp/config.ini')

        # match id -> set of clients
        self.onlineMatches = defaultdict(set)

        super().__init__(conf)

    def start(self):

        # start threads
        # for tname, tcontent in self.threads.items():
        #     thread = threading.Thread(target=tcontent.run)
        #     thread.start()

        # start websocket server
        self.serveforever()

    def client_left(self, client):
        if client.user and client.user.mid:
            try:
                self.onlineMatches[client.user.mid].remove(client)
            except:
                pass

        super().client_connected(client)

    def sendToMatch(self, mid: str, rws: dict):
        clients = self.onlineMatches.get(mid)

        if clients:
            for client in clients:
                self.send(rws, client)

    def getUsersAt(self, mid: str):

        for client in self.onlineMatches[mid]:
            if client.user:
                yield client.user

if __name__ == "__main__":
    app = GeopolyServer()
    app.start()
