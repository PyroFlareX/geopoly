from engine.modules.geomap import service
from testapp.util.RealGameTestCase import RealGameTestCase
from game.util.load_gtml import load_gtml
from testapp.util.simulate_entities import _set_up_match, _finish, _execute


class EdgeCaseSimulation(RealGameTestCase):

    def test_emperor_round(self):
        c, a, calls = load_gtml('testapp/content/edge_match/init.gtml')
        _set_up_match(c, a)

        # todo: somehow put into map file later
        service.switch_conn_graph({
            "AR01": ["AR02", "AR03"],
            "AR02": ["AR01", "AR03"],
            "AR03": ["AR01", "AR02", "ARR04"],
        })

        c, a, calls = load_gtml('testapp/content/edge_match/round1.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c)

        c, a, calls = load_gtml('testapp/content/edge_match/round2.gtml')
        self._assert_calls(*_execute(calls, resp_format='list'))
        self._assert_map(c)

        _finish()
