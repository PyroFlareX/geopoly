from game.instance import countries


class DevController():
    def __init__(self, server):
        self.server = server
        self.group = "Dev"

    def index(self):
        dead = countries.list_eliminated(wid='790b9a91-b051-416b-ab43-29c60ac24c3e')


        return str([c.iso for c in dead])
