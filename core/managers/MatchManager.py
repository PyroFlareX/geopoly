from eme.entities import EntityPatch


class MatchManager():

    def __init__(self):
        super().__init__()
        self.cache = StackMapCache()
        self.store = MatchStore()
        self.factory = MatchFactory()
        self.restore()

    def list(self):
        matches = []
        for slug,match in self.cache.list():
          if match.turn is not None and match.turn.turns == 0:
            matchMeta = match.meta.copy()
            matchMeta['slug'] = slug
            matchMeta['players'] = match.playersView()
            matches.append(matchMeta)
        return matches

    def get(self, slug):
        match = self.cache.get(slug)
        if not match:
            raise RuleException(103)
        return match

    def add(self, match):
        self.cache.add(match)

    def backup(self):
        matches = {}

        for slug,match in self.cache.list():
            if match.turn is not None and match.turn.turns > 0:
                matches[slug] = match.view()

        self.store.saveAll(matches)

    def restore(self):
        matches = self.store.getAll()

        for slug,matchView in matches.items():
            #match.slug = slug
            match = self.factory.fromView(matchView)
            self.cache.add(match)

    def createMatch(self, matchMeta):
        match = self.factory.create(matchMeta)

        self.cache.add(match)
        return match

    def addPlayer(self, match, playerPatch):
        if not isinstance(playerPatch, EntityPatch):
            playerPatch = EntityPatch(playerPatch)

        iso, player = self.factory.createPlayer(match, playerPatch)
        return iso, player

    def checkPlayer(self, match, playerPatch):
        if not isinstance(playerPatch, EntityPatch):
            playerPatch = EntityPatch(playerPatch)

        return self.factory.checkPlayer(match, playerPatch)

    def remove(self, match):
        match.game.dispose()

        self.cache.remove(match.slug)
