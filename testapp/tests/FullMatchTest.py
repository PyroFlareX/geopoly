

# simulate complete match with fictious map
# apply mocked HTTP calls (with fix test WID,PID, etc)
# and check database content in the end


class FullMatchTest():
    def __init__(self, app):
        self.app = app
