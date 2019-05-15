from core.instance import units, worlds, areas
from core.services import scheduler


class TurnCommand():
    def __init__(self, cli):
        self.commands = {
            'turn:new': {
                'help': 'Simulates whole new turn',
                'short': {},
                'long': []
            }
        }

    def runNew(self, *args):
        scheduler.run_batch_updates()
