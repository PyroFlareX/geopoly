import uuid


class MemoryStore():
    def __init__(self, primary):
        self.primary = primary
        self.store = {}

    def get(self, key):
        return self.store.get(key)

    def get_all(self, raw=False):
        if not raw:
            return self.store.values()
        else:
            r = []
            for area in self.store.values():
                r.append(area.toView())

            return r

    def create(self, item):
        if hasattr(item, self.primary):
            key = getattr(item, self.primary)
        else:
            key = None
            while key is None or key in self.store:
                key = uuid.uuid4()

            setattr(item, self.primary, key)

        if key in self.store:
            return False
        self.store[key] = item

    def save(self, item):
        key = getattr(item, self.primary)

        self.store[key] = item

    def delete(self, keyItem=None):
        try:
            # check if it's an item
            key = getattr(keyItem, self.primary)
        except:
            # it's probably a primary key
            key = keyItem

        if key in self.store:
            del self.store[key]

    def delete_all(self):
        self.store = {}

