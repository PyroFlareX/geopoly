from time import sleep

from game.instance import worlds
from game.services import endgame


class DisposalTask:

    def __init__(self, scheduler):
        self.scheduler = scheduler

    def run(self):
        to_delete_worlds = worlds.list_finished()

        for i,world in enumerate(to_delete_worlds):
            # count statistics for world's match history
            endgame.populate_match_history(world)

            # then delete world (and cascades countries, areas)
            worlds.delete(world, commit=False)

            if i % 20 == 0:
                # make sure to save changes every once in a while
                worlds.session.commit()

                # rest for 80ms
                sleep(0.08)

        worlds.session.commit()
