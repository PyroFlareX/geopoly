import uuid

from core.entities import Area
from core.rules import getMilPop


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

    def save_all(self, items):
        for item in items:
            self.save(item)

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


class MemoryParentStore(MemoryStore):
    def __init__(self, primary):
        super().__init__(primary)

    def get(self, mid: uuid.UUID, key: str, raw=False):
        key = str(mid) + '-' + key

        enty = super().get(key)

        if not enty:
            return enty

        if raw:
            return enty.toView()

        return enty

    def get_all(self, mid, raw=False):
        l = []

        for v in self.store.values():
            if v.mid == mid:
                if not raw:
                    l.append(v)
                else:
                    l.append(v.toView())

        return l

    def create(self, item):
        key = item.mid + '-' + getattr(item, self.primary)

        self.store[key] = item

    def save(self, item):
        key = item.mid + '-' + getattr(item, self.primary)

        self.store[key] = item

    def delete(self, item):
        key = item.mid + '-' + getattr(item, self.primary)
        return super().delete(key)

    def delete_all(self, mid):
        raise Exception("NOT IMPLEMENTED")


class AreaStore(MemoryParentStore):
    def __init__(self, primary):
        super().__init__(primary)

    def get(self, mid, key):
        area = super().get(mid, key)

        if not area:
            area = Area(id=key, mid=mid)

        return area

    def get_all_with_units(self, mid):
        lareas = []

        area: Area
        for area in self.store.values():
            if area.mid == mid:
                if getMilPop(area) > 0:
                    lareas.append(area)

        return lareas

    def get_all_with_units_iter(self, mid):
        area: Area
        for area in self.store.values():
            if area.mid == mid:
                if getMilPop(area) > 0:
                    yield area
