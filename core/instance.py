from core import settings
from core.dal.ctx import session
from core.dal.localstores import MemoryStore, AreaStore, MemoryParentStore
from core.dal.repositories import UserRepository, UnitRepository, AreaRepository, WorldRepository

storage = settings.get('server.storage')

users = UserRepository(db_session=session)

units = UnitRepository(db_session=session)

areas = AreaRepository(db_session=session)

worlds = WorldRepository(db_session=session)

if storage == 'memory':
    pass
    # Server stores entities in memory

    #players = MemoryStore('pid')


    # matches = MemoryStore('mid')
    # #countries = MemoryStore('cid')
    # areas = AreaStore('id')

elif storage == 'redis':
    # Server uses redis
    pass
else:
    # Server uses database
    pass
