from cliapp.scheduler import Scheduler


class TasksCommand():
    def __init__(self, server):
        self.server = server
        self.scheduler = None

        self.commands = {
            'tasks': {
                'help': 'Runs all tasks',
                'short': {},
                'long': []
            },
        }

    def getSch(self):
        if not self.scheduler:
            self.scheduler = Scheduler()

        return self.scheduler

    def run(self):
        self.getSch().run()
