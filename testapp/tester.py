import json

import numpy as np
from eme.tests import TestApp

np.set_printoptions(precision=2)
np.set_printoptions(suppress=True)
np.set_printoptions(linewidth=200)


class GeopolyTester(TestApp):

    def __init__(self):
        super().__init__(directory='testapp/')

    def readMock(self, name, entity):

        with open('testapp/mocks/{}.json'.format(name)) as fh:
            content = json.load(fh)

        return entity(**content)
