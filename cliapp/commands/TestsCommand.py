from cliapp.scheduler import Scheduler


class TestsCommand():
    def __init__(self, server):
        self.server = server
        self.scheduler = None

        self.commands = {
            'tests:all': {
                'help': 'Runs all tests',
                'short': {},
                'long': []
            },

        }

    def getSch(self):
        if not self.scheduler:
            self.scheduler = Scheduler()

        return self.scheduler

    def runAll(self):
        print("todo")
