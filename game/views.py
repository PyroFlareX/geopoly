

class RoundEventsView:
    def __init__(self, **kwargs):
        self.wid = kwargs.get('wid')
        self.round = kwargs.get('round')

        self.payday = kwargs.get('payday')
        self.emperor = kwargs.get('emperor')

        self.killed = kwargs.get('killed')
        self.eliminated = kwargs.get('eliminated')

    def to_dict(self):
        return {
            "wid": self.wid,
            "round": self.round,
            "payday": self.payday,
            "emperor": self.emperor,
            "killed": self.killed,
            "eliminated": self.eliminated,
        }


