import random
import string
import time
import bcrypt
import hashlib

from core.entities import User
from core.instance import users


class UserException(Exception):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return str(self.reason)


class UserManager:
    def __init__(self):
        pass

    def create(self, **userPatch):
        raw_password = userPatch.pop('password')
        raw_password2 = userPatch.pop('password-confirm')

        user = User(**userPatch)

        # pw don't match
        if not raw_password == raw_password2:
            raise UserException('passwords_differ')
        # email exists
        if users.get(email=user.email):
            raise UserException('email_exists')
        # username exists
        if users.get(username=user.username):
            raise UserException('user_exists')

        # create user & pw salt
        user.password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user.salt = bcrypt.gensalt().decode('utf-8')
        user.token = self.getToken(user)
        users.create(user)

        return user

    def getUser(self, uid):
        user = users.get(uid)

        return user

    def authenticateToken(self, uid, token):
        user = users.get(uid)
        if not user:
            raise UserException('user_doesnt_exist')

        # user
        if user.token == token:

            return user
        else:
            raise UserException('wrong_token')

    def authenticateCredentials(self, password, email=None, username=None):
        if email:
            user = users.get(email=email)

            if not user:
                raise UserException('email_not_found')
        else:
            user = users.get(username=username)

            if not user:
                raise UserException('user_not_found')

        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            user.token = self.getToken(user)
            users.save(user)

            return user
        else:
            raise UserException('wrong_password')

    def authenticateCode(self, code):
        user = users.get(code=code)

        return user

    def getToken(self, user):
        swd = '-'
        salt = str(user.uid) + swd + user.salt + "GPL2018v9$__SALUD" + str(time.time())
        token = hashlib.sha256(salt.encode('utf-8')).hexdigest()

        return token

    def forgot(self, nameOrEmail):
        user = users.get(email=nameOrEmail)

        # #let's try with username
        # if not user:
        #     user = users.get(name=nameOrEmail)

        if not user:
            return None

        N = 128
        code = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(N))

        user.forgot_code = code
        users.save(user)

        return code

    def reset_password(self, code, raw_password, raw_password2):

        if not raw_password == raw_password2:
            raise UserException('passwords_differ')

        user = users.get(code=code)

        if not user:
            raise UserException('wrong_code')

        user.password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user.salt = bcrypt.gensalt().decode('utf-8')
        user.token = self.getToken(user)
        user.forgot_code = None
        users.save(user)

        return user
