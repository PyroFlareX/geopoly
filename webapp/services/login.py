import uuid

from flask_login import LoginManager, current_user, login_user

from core.entities import User
from webapp.entities import UserAuth

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
        # fetch anon user
        user = User(uid="guest", username=None)

        login_user(UserAuth(user), remember=True)

    return current_user
