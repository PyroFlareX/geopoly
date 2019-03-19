from eme.entities import loadConfig
from eme.website import WebsiteApp

#from webapp.services.login import init_login


class Website(WebsiteApp):


    def __init__(self):
        # eme/examples/simple_website is the working directory.
        self.conf = loadConfig('webapp/config.ini')

        super().__init__(self.conf)

        #init_login(self, self.conf['login'])
