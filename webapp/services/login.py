import uuid

from flask_login import LoginManager, current_user, login_user, logout_user, login_required

from core.entities import User
from core.instance import users
from webapp.entities import UserAuth

# guestManager = GuestManager()
loginManager = LoginManager()


def init_login(server, conf):
    global loginManager

    server.config["SECRET_KEY"] = conf.get("secret_key")
    loginManager.init_app(server)
    loginManager.login_view = "get__users/login"


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


def forceAnonLogin(uid):
    anon = User(uid=uuid.uuid4(), username=None)

    setUser(anon)


def setUser(user, remember=True):
    if not isinstance(user, UserAuth):
        user = UserAuth(user)

    login_user(user, remember=remember)


def logout():
    logout_user()
