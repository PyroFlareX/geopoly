from eme.entities import loadConfig
from eme.websocket import WebsocketApp


class GeopolyServer(WebsocketApp):

    def __init__(self):
        conf = loadConfig('serverapp/config.ini')

        super().__init__(conf)

    def start(self):

        # start threads
        # for tname, tcontent in self.threads.items():
        #     thread = threading.Thread(target=tcontent.run)
        #     thread.start()

        # start websocket server
        self.serveforever()


if __name__ == "__main__":
    app = GeopolyServer()
    app.start()
