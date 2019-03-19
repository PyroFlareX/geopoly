from flask_login import LoginManager, current_user, login_user

from webapp.entities import UserAuth, UserAnon

# userManager = UserManager()
# guestManager = GuestManager()
loginManager = LoginManager()


def init_login(server, conf):
    global loginManager

    server.config["SECRET_KEY"] = conf.get("secret_key")
    loginManager.init_app(server)
    loginManager.login_view = "get_users/login"


@loginManager.user_loader
def load_user(userid):
    return None

def getUser() -> UserAuth:
    if not current_user.is_authenticated:
        anon: Guest = guestManager.login_anon()

        login_user(UserAnon(anon), remember=True)

    return current_user
