import uuid

from core.entities import User
from core.instance import matches, users
from serverapp.services import login


class UsersGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Users'

        self.server.no_auth.update([
            'Users:auth',
            'Users:guest',
        ])

    def guest(self, uid, client):
        user = login.get_user(uid)

        if client not in self.server.onlineHall:
            self.server.onlineHall.add(client)

        user.client = client
        client.user = user

        # if user.mid:
        #     # load match
        #     match = matches.get(user.mid)

        return {
            "user": user.toView()
        }
