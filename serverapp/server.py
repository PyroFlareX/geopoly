import threading
from collections import defaultdict

from eme.entities import loadConfig, loadHandlers
from eme.websocket import WebsocketApp


class GeopolyServer(WebsocketApp):

    def __init__(self):
        conf = loadConfig('serverapp/config.ini')

        # match id -> set of clients
        self.onlineMatches = defaultdict(set)
        self.onlineHall = set()

        self.threads = loadHandlers(self, "Thread", prefix=conf['websocket']['groups_folder'])

        super().__init__(conf)

    def start(self):
        # start threads
        for tname, tcontent in self.threads.items():
            thread = threading.Thread(target=tcontent.run)
            thread.start()

        # start websocket server
        self.serveforever()

    def client_enter_world(self, client):
        if client in self.onlineHall:
            self.onlineHall.remove(client)

        self.onlineMatches[str(client.user.wid)].add(client)

    def client_connected(self, client):
        if client.user and client.user.wid:
            self.client_enter_world(client)
        else:
            self.onlineHall.add(client)

        super().client_connected(client)

    def client_left(self, client):
        if client.user and client.user.wid:
            if client in self.onlineMatches[str(client.user.wid)]:
                self.onlineMatches[str(client.user.wid)].remove(client)

            elif client in self.onlineHall:
                self.onlineHall.remove(client)

        super().client_left(client)

    def send_to_world(self, mid: str, rws: dict):
        clients = self.onlineMatches.get(str(mid))

        if clients:
            for client in clients:
                self.send(rws, client)

    def send_to_hall(self, rws: dict):

        for client in self.onlineHall:
            self.send(rws, client)

    def get_client_at(self, mid: str):
        for client in self.onlineMatches[str(mid)]:
            yield client


if __name__ == "__main__":
    app = GeopolyServer()
    app.start()
