from core.entities import User


class UsersGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Users'

        self.server.no_auth.update([
            'Users:auth',
            'Users:guest',
        ])

    def guest(self, uid, client):
        user = User(uid=uid)

        if client not in self.server.onlineHall:
            self.server.onlineHall.add(client)

        user.client = client
        client.user = user

        return {

        }
