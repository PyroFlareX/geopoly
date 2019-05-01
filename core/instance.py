from core import settings
from core.dal.ctx import session
from core.dal.localstores import MemoryStore, AreaStore, MemoryParentStore
from core.dal.repositories import UserRepository, DeckRepository

storage = settings.get('server.storage')

users = UserRepository(db_session=session)

decks = DeckRepository(db_session=session)

if storage == 'memory':
    # Server stores entities in memory

    #players = MemoryStore('pid')


    matches = MemoryStore('mid')
    #countries = MemoryStore('cid')
    areas = AreaStore('id')

elif storage == 'redis':
    # Server uses redis
    pass
else:
    # Server uses database
    pass
