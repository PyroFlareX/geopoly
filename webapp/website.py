from eme.entities import loadConfig, loadHandlers
from eme.website import WebsiteApp

from webapp.services import login, mail, filters


class Website(WebsiteApp):

    def __init__(self):
        self.conf = loadConfig('webapp/config.ini')

        if self.conf['website']['devcontrollers'] == 'true':
            # add extra controllers
            self.controllers = loadHandlers(self, "DevController", prefix=self.conf['website']['controllers_folder'])

        super().__init__(self.conf)

        self.jinja_env.globals.update(get_user=login.getUser)
        filters.init_jinja_filters(self)

        login.init_login(self, self.conf['login'])
        mail.init_mail(self, self.conf['mail'])
