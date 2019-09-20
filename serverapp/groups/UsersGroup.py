from engine.modules.auth.UsersGroupBase import UsersGroupBase
from game.instance import users


class UsersGroup(UsersGroupBase):

    def __init__(self, server):
        super().__init__(server, users)
