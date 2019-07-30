import numpy as np

from game.entities import Town
from game.services import Gathering


class GatheringTest():
    def __init__(self, server):
        self.server = server

    def test_gather_nothing(self):
        """
        Lvl 0 resource fields should yield 0 resource, except for population
        """
        dMoney, dClay, dIron, dCrop = 0,0,0,0

        try:
            town: Town = self.server.readMock('town_default', Town)

            dMoney, dClay, dIron, dCrop = Gathering.calculateProduction(town)

            assert dClay == 0
            assert dIron == 0
            assert dCrop >= 0

            print("GATHER NOTHING: success")
        except AssertionError as e:
            print("GATHER NOTHING: FAIL")

            print('dMoney, dClay, dIron, dCrop:')
            print(dMoney, dClay, dIron, dCrop)
        except Exception as e:
            print("GATHER NOTHING: FAILNE: {}".format(e))
            raise e

    def test_gather_scaling(self):
        """
        Leveling up different resource fields should yield an increase in production
        """
        resource = None
        scaling = {
            'clay': [],
            'iron': [],
            'money': [],
            'crop': []
        }

        try:

            for i,resource in enumerate(['money', 'clay', 'iron', 'crop']):
                town: Town = self.server.readMock('town_default', Town)

                # Calculate initial production at 0
                # gathering = Gathering.calculateProduction(town)
                # scaling[resource].append(gathering[i])

                # level up each field (ci = number of field)
                for ci in range(1, 4+1):
                    # level of resource field
                    for lvl in range(1, 10+1):
                        setattr(town, resource+str(ci), lvl)

                        gathering = Gathering.calculateProduction(town)
                        scaling[resource].append(gathering[i])

                # finally, let's level up production boosters
                for lvl in range(1, 5+1):

                    if resource == 'clay':
                        setattr(town, 'b_brickyard', lvl)
                    elif resource == 'money':
                        setattr(town, 'b_bank', lvl)
                    elif resource == 'iron':
                        setattr(town, 'b_factory', lvl)
                    elif resource == 'crop':
                        setattr(town, 'b_mill', lvl)

                    gathering = Gathering.calculateProduction(town)
                    scaling[resource].append(gathering[i])

            # check if strictly increasing
            resource = 'clay'
            assert np.all(np.diff(scaling['clay']) > 0)
            resource = 'iron'
            assert np.all(np.diff(scaling['iron']) > 0)
            resource = 'crop'
            assert np.all(np.diff(scaling['crop']) > 0)
            resource = 'money'
            assert np.all(np.array(scaling['money']) == 0)

            # Money is dependent on population
            town: Town = self.server.readMock('town_default', Town)
            scaling['money'] = []

            for pop in range(0, 1000, 50):
                town.pop = pop

                dMoney, _, _, _ = Gathering.calculateProduction(town)
                scaling['money'].append(dMoney)

            resource = 'money'
            assert np.all(np.diff(scaling['money']) > 0)

            print("GATHER SCALING: success")
        except AssertionError as e:
            print("GATHER SCALING: FAIL ({})".format(resource))

            print('gradient array:')
            print(scaling[resource])
        except Exception as e:
            print("GATHER SCALING: FAILNE: {}".format(e))
            raise e
