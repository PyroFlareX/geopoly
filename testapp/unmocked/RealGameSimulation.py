import unittest
import uuid
from unittest import mock

from game.instance import worlds, countries, areas, users
from testapp.unmocked.load_gtml import load_gtml
from testapp.unmocked.simulate_entities import _set_up_game, _finish, _get_user, _set_up_gtml, _execute
from testapp.webmock import mock_ws

"""
This test case does the same as GameTest

but here the database is NOT mocked out.
everything is done really under test wid, only without the Frontend
"""


from engine.modules.geomap import service
from game.entities import Country, Area, World, User


class RealGameSimulationTest(unittest.TestCase):

    def test_match(self):
        c,a, calls = load_gtml('real_match/init.gtml')
        _set_up_game(c,a)

        c, a, calls = load_gtml('real_match/round1.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        #self._assert_map(c,a)

        print(1)
        #a, c, calls = load_gtml('real_match/round2.gtml')
        #a, c, calls = load_gtml('real_match/round3.gtml')

        _finish()

    def _assert_calls(self, calls, resps, expects):

        for (route, params), responses, expects in zip(calls, resps, expects):
            # if len(expects) == len(responses):
            #     for resp in resps:
            #         if 'err' in resp:
            #             self.fail('Error in response: ' + resp['err'])

            for resp_exp, resp_obs in zip(expects, responses):
                # find and display only the differing keys!
                MSG = 'Incorrect call {} with params {}. Missing keys:\n\n'.format(route, params)
                if 'err' not in resp_exp and 'err' in resp_obs:
                    MSG += '  {}:    {}'.format('err', resp_obs['err'])
                else:
                    for _key in resp_exp.keys():
                        #list()+list(resp_obs.keys()):

                        _exp = resp_exp.get(_key)
                        _obs = resp_obs.get(_key)

                        if _exp != _obs:
                            MSG += '  {:<8}:    {:<16} != {:<16}\n'.format(_key, str(_exp), str(_obs))

                    lset = set(resp_obs.keys()) - set(resp_exp.keys())
                    if lset:
                        MSG += '\nInstead we got response:\n\n'
                        for _key in lset:
                            MSG += '  {:<8}:    {:<16}\n'.format(_key, str(resp_obs.get(_key)))


                if resp_exp != resp_obs:
                    self.fail(MSG)
                    #self.assertEqual(resp_exp, resp_obs)#, MSG)

    def _assert_map(self, l_countries, l_areas):
        pass
