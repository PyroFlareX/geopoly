import sys
import unittest

from testapp.util.simulate_entities import _load_map

"""
This test case does the same as GameTest

but here the database is NOT mocked out.
everything is done really under test wid, only without the Frontend
"""


def test_dict_area(area):
    return {
        "id": area.id,
        "iso": area.iso,
        "iso2": area.iso2,
        "exhaust": area.exhaust,
        "build": area.build,
        "tile": area.tile,
        "unit": area.unit,
    }


def test_dict_country(country):
    return {
        "iso": country.iso,
        "gold": country.gold,
        "pop": country.pop,
        "order": country.order,
        "emperor": country.emperor,
        "shields": country.shields,
    }


class RealGameTestCase(unittest.TestCase):


    def _assert_calls(self, calls, resps, expects):

        for (route, params), responses, expects in zip(calls, resps, expects):
            # if len(expects) == len(responses):
            #     for resp in resps:
            #         if 'err' in resp:
            #             self.fail('Error in response: ' + resp['err'])
            if route == 'STOP_TEST':
                sys.exit()

            for resp_exp, resp_obs in zip(expects, responses):
                # find and display only the differing keys!
                MSG = 'Incorrect call {} with params {}. Missing keys:\n\n'.format(route, params)
                if 'err' not in resp_exp and 'err' in resp_obs:
                    MSG += '  {}:    {}'.format('err', resp_obs['err'])
                else:
                    MSG += self._form_dict_cmp(resp_exp, resp_obs)

                    lset = set(resp_obs.keys()) - set(resp_exp.keys())
                    if lset:
                        MSG += '\nInstead we got response:\n\n'
                        for _key in lset:
                            MSG += '  {:<8}:    {:<16}\n'.format(_key, str(resp_obs.get(_key)))


                if resp_exp != resp_obs:
                    self.fail(MSG)
                    #self.assertEqual(resp_exp, resp_obs)#, MSG)

    def _assert_map(self, t_countries, t_areas):
        o_countries, o_areas = _load_map()
        o_countries = {c.iso: c for c in o_countries}
        o_areas = {a.id: a for a in o_areas}

        for exp_country in t_countries:
            obs_country = o_countries[exp_country.iso]
            MSG = 'Country {} is not as expected. Missing keys:\n\n'.format(exp_country.iso)
            MSG += self._form_dict_cmp(test_dict_country(obs_country), test_dict_country(exp_country))

            self.assertEqual(test_dict_country(obs_country), test_dict_country(exp_country), msg=MSG)

        for exp_area in t_areas:
            obs_area = o_areas[exp_area.id]
            MSG = 'Area {} is not as expected. Missing keys:\n\n'.format(exp_area.id)
            MSG += self._form_dict_cmp(test_dict_area(obs_area), test_dict_area(exp_area))

            self.assertEqual(test_dict_area(obs_area), test_dict_area(exp_area), msg=MSG)

    def _form_dict_cmp(self, dict_obs, dict_exp):
        MSG = ""

        for _key in dict_exp.keys():
            # list()+list(dict_obs.keys()):

            _exp = dict_exp.get(_key)
            _obs = dict_obs.get(_key)

            if _exp != _obs:
                MSG += '  {:<8}:    {:<16} != {:<16}\n'.format(_key, str(_exp), str(_obs))

        return MSG
