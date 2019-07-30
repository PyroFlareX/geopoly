from engine import settings
from game.ctx import session

storage = settings.get('server.storage')


if storage == 'database':
    from game.repositories import AreaRepository, UserRepository, WorldRepository

    areas = AreaRepository(db_session=session)

    users = UserRepository(db_session=session)

    worlds = WorldRepository(db_session=session)

elif storage == 'redis':
    pass
elif storage == 'memory':
    pass
