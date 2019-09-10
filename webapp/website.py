from eme.entities import loadConfig, loadHandlers
from eme.website import WebsiteApp

from webapp.services import login, mail, filters


class Website(WebsiteApp):

    def __init__(self):
        self.conf = loadConfig('webapp/config.ini')

        super().__init__(self.conf)

        self.jinja_env.globals.update(get_user=login.getUser)
        filters.init_jinja_filters(self)

        login.init_login(self, self.conf['login'])
        mail.init_mail(self, self.conf['mail'])
