from testapp.util.RealGameTestCase import RealGameTestCase
from testapp.util.load_gtml import load_gtml
from testapp.util.simulate_entities import _set_up_game, _finish, _execute


class RealGameSimulation(RealGameTestCase):

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
