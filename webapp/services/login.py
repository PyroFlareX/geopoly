import uuid

from flask import request
from flask_login import LoginManager, current_user, login_user

from core.entities import User
from core.instance import users
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
def load_user(uid):
    user = users.get(uid)

    if not user:
        user = User(uid=uuid.UUID(uid), username=None)

    return UserAuth(user)


def getUser() -> UserAuth:

    if not current_user.is_authenticated:
        # fetch anon user
        user = User(uid=uuid.uuid4(), username=None)

        setUser(UserAuth(user))

    return current_user

def setUser(user):
    login_user(user, remember=True)
