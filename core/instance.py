from core import settings
from core.dal.localstores import MemoryStore

storage = settings.get('server.storage')

if storage == 'memory':
    # Server stores entities in memory

    users = MemoryStore('uid')
    players = MemoryStore('pid')

    matches = MemoryStore('mid')
    countries = MemoryStore('cid')
    areas = MemoryStore('id')

elif storage == 'redis':
    # Server uses redis
    pass
else:
    # Server uses database
    pass
