from eme.entities import loadConfig
from eme.website import WebsiteApp

from webapp.services.login import init_login
from webapp.services import login, mail


class Website(WebsiteApp):


    def __init__(self):
        # eme/examples/simple_website is the working directory.
        self.conf = loadConfig('webapp/config.ini')

        super().__init__(self.conf)

        self.jinja_env.globals.update(get_user=login.getUser)

        login.init_login(self, self.conf['login'])
        mail.init_mail(self, self.conf['mail'])
