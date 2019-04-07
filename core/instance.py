from core import settings
from core.dal.ctx import session
from core.dal.localstores import MemoryStore, AreaStore, MemoryParentStore
from core.dal.repositories import UserRepository

storage = settings.get('server.storage')

users = UserRepository(db_session=session)

if storage == 'memory':
    # Server stores entities in memory

    #players = MemoryStore('pid')

    decks = MemoryParentStore('did')

    matches = MemoryStore('mid')
    #countries = MemoryStore('cid')
    areas = AreaStore('id')

elif storage == 'redis':
    # Server uses redis
    pass
else:
    # Server uses database
    pass
