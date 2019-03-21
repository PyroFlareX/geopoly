from core.instance import areas


class AreasGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Areas'

        self.server.no_auth.update([
            'Areas:load'
        ])

    def load(self, client=None, user=None):

        lareas = areas.get_all(raw=True)


        return {
            "areas": lareas
        }
