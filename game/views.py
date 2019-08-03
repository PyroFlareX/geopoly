

class RoundEvents:
    def __init__(self, **kwargs):
        self.wid = kwargs.get('wid')
        self.round = kwargs.get('round')

        self.payday = kwargs.get('payday')
        self.emperor = kwargs.get('emperor')

        self.killed = kwargs.get('killed')
        self.eliminated = kwargs.get('eliminated')


    def to_dict(self):
        return {
        }
