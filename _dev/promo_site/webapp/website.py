from eme.entities import loadConfig
from eme.website import WebsiteApp


class Website(WebsiteApp):

    def __init__(self):
        self.conf = loadConfig('webapp/config.ini')

        super().__init__(self.conf)
