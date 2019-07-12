from engine import settings
from core.ctx import session

storage = settings.get('server.storage')


if storage == 'database':
    from core.repositories import AreaRepository, UserRepository

    areas = AreaRepository(db_session=session)

    users = UserRepository(db_session=session)
elif storage == 'redis':
    pass
elif storage == 'memory':
    pass
