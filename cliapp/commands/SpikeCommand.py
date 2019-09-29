from game.instance import countries, worlds


class SpikeCommand():
    def __init__(self, server):
        self.server = server
        self.scheduler = None

        self.commands = {
            'spike': {
                'help': 'spike test',
                'short': {},
                'long': []
            },
        }

    def run(self):
        wid = '00000000-0000-2000-a000-000000000000'

        # see if sess is cached
        world = worlds.get(wid)

        cc = world.countries

        print(1)

        # See if get by complex primary key is cached


        # See if get by subentities is cached


        #countries.get
