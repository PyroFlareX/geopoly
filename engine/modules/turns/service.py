from random import shuffle
from collections import deque


class TurnBox():

    def __init__(self, world, playerIds):
        self.world = world
        self.playerIds = list(playerIds)
        self.deque = deque(playerIds)

    def randomize(self):
        shuffle(self.playerIds)
        self.deque = deque(self.playerIds)

    def reset(self):
        self.world.turns = 1
        self.world.rounds = 1
        self.world.current = None

    def start(self, start=None):
        if not start:
            if self.world.current:
                start = self.world.current
            else:
                start = self.deque[0]

            if self.world.turns == 0 and self.world.rounds == 0:
                self.world.rounds = 1
            self.world.turns += 1


        self.deque = deque(self.playerIds)
        i = self.deque.index(start)
        self.deque.rotate(-i)
        self.iter = iter(self.deque)
        self.world.current = next(self.iter)

        return self.world.current

    def next(self):
        try:
            self.world.current = next(self.iter)
            self.world.turns += 1
        except StopIteration:
            if self.world.current == None:
                # we have already reached the end before
                return None

            # None means that there are no more people in the round
            self.world.current = None
            self.world.rounds += 1
        except Exception as e:
            raise e

        return self.world.current

    def to_dict(self):
        return {
            "players": self.playerIds,
            "start": self.deque[0],
            "current": self.world.current,

            "turns": self.world.turns,
            "round": self.world.rounds
        }