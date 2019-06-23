from eme.entities import loadHandlers


class Scheduler():

    def __init__(self):
        self.tasks = loadHandlers(self, 'Task', prefix='cliapp/')

    def run(self):
        for name, task in self.tasks.items():
            task.run()
