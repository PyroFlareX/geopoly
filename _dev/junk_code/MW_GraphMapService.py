import collections
from bll.entities.Cell import Cell
from bll.services.MapService import MapService
from vendor.eme.file import loadContent, unloadContent


class GraphMapService(MapService):

    def __init__(self, name):
        super().__init__()
        self.connections = loadContent("Map/conn_"+name, patch=False)
        baseGrid = loadContent("Map/base_"+name, patch=False)
        self.grid = {key:Cell(**cell) for key, cell in baseGrid.items()}
        unloadContent("Map-base_"+name)

    def __getitem__(self, coord):
        if coord not in self.grid:
            return None
        return self.grid[coord]

    def __setitem__(self, coord, value):
        self.grid[coord] = value

    def __delitem__(self, coord):
        if coord not in self.grid:
            return False
        del self.grid[coord]

    def __iter__(self):
        return iter(self.grid.items())

    def neighbors(self, coord, filters=None):
        if not filters:
            return self.connections[coord]
        else:
            return None

    def areNeighbors(self, coord1, coord2):
        return coord1 in self.connections and coord2 in self.connections[coord1]

    def ring2(self, coord1):
        visited = {coord1}
        yield coord1

        for n in self.connections[coord1]:
            if n in visited:
                continue
            visited.add(n)
            yield n

            for n2 in self.connections[n]:
                if n2 in visited:
                    continue
                visited.add(n2)
                yield n2

    def areInRing2(self, coord1, coord2):
        for n2 in self.ring2(coord1):
            if n2 == coord2:
                return True
        return False
    
    def BFS(self, coord, filters=None):
        degree = 0
        visited, queue = set(), collections.deque([coord])

        while queue:
            vertex = queue.popleft()
            yield vertex

            if vertex in self.connections:
                for neighbour in self.connections[vertex]:
                    if neighbour not in visited:
                        visited.add(neighbour)

                        matches = True
                        if filters:
                            for key, value in filters.items():
                                if vertex not in self.grid:
                                    matches = False
                                    break
                                real = getattr(self.grid[vertex], key)

                                if isinstance(value, list) or isinstance(value, tuple):
                                    if not real in value:
                                        matches = False
                                        break
                                else:
                                    if not real == value:
                                        matches = False
                                        break
                        if matches:
                            queue.append(neighbour)
            degree += 1
        #return visited

    def view(self):
        return {area:cell.view() for area, cell in self.grid.items()}

    @staticmethod
    def fromView(mapView):
        return {area:Cell.fromView(cellView) for area, cellView in mapView.items()}

    def dispose(self):
        self.grid = None
        self.connections = None
