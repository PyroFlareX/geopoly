from testapp.util.RealGameTestCase import RealGameTestCase
from game.util.load_gtml import load_gtml
from testapp.util.simulate_entities import _set_up_game, _finish, _execute


class RealGameSimulation(RealGameTestCase):

    def test_match(self):
        c, a, calls = load_gtml('testapp/content/real_match/init.gtml')
        _set_up_game(c, a)

        print("\nROUND 1")
        c, a, calls = load_gtml('testapp/content/real_match/round1.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c, a)

        print("\nROUND 2")
        c, a, calls = load_gtml('testapp/content/real_match/round2.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c, a)

        print("\nROUND 3")
        c, a, calls = load_gtml('testapp/content/real_match/round3.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c, a)

        print("\nROUND 4")
        c, a, calls = load_gtml('testapp/content/real_match/round4.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c, a)

        # todo: assert victory & endgame & match history

        _finish()
