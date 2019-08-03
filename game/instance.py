from engine import settings
from game.ctx import db_session

storage = settings.get('server.storage')


if storage == 'database':
    from game.repositories import AreaRepository, UserRepository, WorldRepository, CountryRepository

    users = UserRepository(db_session=db_session)

    worlds = WorldRepository(db_session=db_session)

    countries = CountryRepository(db_session=db_session)

    areas = AreaRepository(db_session=db_session)

elif storage == 'redis':
    pass
elif storage == 'memory':
    pass
