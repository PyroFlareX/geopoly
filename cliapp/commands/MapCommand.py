from core.services.areas import conn_graph, _dfs

class MapCommand():
    def __init__(self, cli):
        self.commands = {
            'map:connectivity': {
                'help': 'Checks map connectivity',
                'short': {},
                'long': []
            }
        }

    def runConnectivity(self, *args):
        discovered = set()

        nodes = conn_graph.keys()
        disconnected = []

        for node in nodes:
            disc = {
                "start_node": node,
                "num": 0,
            }

            if node not in discovered:
                L0 = len(discovered)
                _dfs(node, discovered=discovered)
                L1 = len(discovered)

                disc['num'] = L1 - L0
                disconnected.append(disc)

        print("All connected graphs in map (1 is preferred):")
        for disc in sorted(disconnected, key=lambda x: x['num'], reverse=True):
            print(" ", disc['start_node'], 'size:', disc['num'])

