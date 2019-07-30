
class TurnController():

    def __init__(self, server):
        self.server = server
        self.group = "Turn"

        self.server.addUrlRule({
            'GET /api/turn/end': 'turn/end_turn',
            'GET /api/turn/start': 'turn/start',
        })

    def get_end_turn(self):
        """Player ends their current turn
        """
        pass

    def get_start(self):
        """Starts game with turns and players
        """
        pass

    def get_state(self):
        """Returns turns state as json for the client
        """

        pass
