

class RoundEventsView:
    def __init__(self, **kwargs):
        self.wid = kwargs.get('wid')
        self.round = kwargs.get('round')
        self.isos = kwargs.get('isos')

        self.payday = kwargs.get('payday')
        self.emperor = kwargs.get('emperor')
        self.ex_emperor = kwargs.get('ex_emperor')

        self.eliminated = kwargs.get('eliminated')

    def to_dict(self):
        return {
            "round": self.round,
            "payday": self.payday,
            "isos": self.isos,
            "emperor": self.emperor.iso if self.emperor else None,
            "ex_emperor": self.ex_emperor.iso if self.ex_emperor else None,
            "eliminated": sorted(list(self.eliminated)),
        }


