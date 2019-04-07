from eme.websocket import WSClient

from core.entities import User


class UserAuthWS(User):
    def __init__(self, user: User, client: WSClient=None):
        User.__init__(self, **user.__dict__)

        self.id = self.uid
        self.client = client

    def __repr__(self):
        return "%s (%s)" % (self.email, self.uid)
