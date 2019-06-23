from core.exceptions import GuardedAreaException
from core.services import areas, moves

WID = "W_TEST"
PID = "P_TEST"


class MoveTest():
    def __init__(self, app):
        self.app = app
        self.app.WID = WID
        self.app.PID = PID

        areas.conn_graph = {
            "area1": ["area2", "area3"],
            "area2": ["area1", "area3"],
            "area3": ["area1", "area2"],
        }

    def test_move_fail_empty(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [])

        # to area
        area2 = self.app._area('area2', 'UK')
        tounits = self.app._units(area2.id, 'UK', [], 'to')

        try:
            assert not moves.bulk_move_to(myunits, area1, area2, WID, PID)

            print("MOVE_FAIL: Success")
        except (AssertionError) as e:
            print("MOVE_FAIL: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_FAIL: FailNE: {}".format(e))
            raise e

    def test_move_simple(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'UK')
        tounits = self.app._units(area2.id, 'UK', [], 'to')

        try:
            assert moves.bulk_move_to(myunits, area1, area2, WID, PID)

            for unit1 in myunits:
                assert unit1.aid == area2.id
                #assert unit1.move_left ==

            print("MOVE_SIMPLE: Success")
        except (AssertionError) as e:
            print("MOVE_SIMPLE: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_SIMPLE: FailNE: {}".format(e))
            raise e

    def test_move_simple_fail(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'UK')
        tounits = self.app._units(area2.id, 'UK', [1,1,1,1,2,2,2,2,3], 'to')

        try:
            assert not moves.bulk_move_to(myunits, area1, area2, WID, PID)

            for unit1 in myunits:
                assert unit1.aid == area1.id
                #assert unit1.move_left ==

            print("MOVE_SIMPLE_FAIL: Success")
        except (AssertionError) as e:
            print("MOVE_SIMPLE_FAIL: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_SIMPLE_FAIL: FailNE: {}".format(e))
            raise e


    def test_move_incastle(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'UK', castle=3)
        tounits = self.app._units(area2.id, 'UK', [1,1,1,1,2,2,2,2,3], 'to')

        try:
            assert moves.bulk_move_to(myunits, area1, area2, WID, PID)

            for unit1 in myunits:
                assert unit1.aid == area2.id
            for unit1 in tounits:
                assert unit1.aid == area2.id
                #assert unit1.move_left ==

            print("MOVE_INCASTLE: Success")
        except (AssertionError) as e:
            print("MOVE_INCASTLE: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_INCASTLE: FailNE: {}".format(e))
            raise e

    def test_move_incastle_fail(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'UK', castle=3)
        tounits = self.app._units(area2.id, 'UK', [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5], 'to')

        try:
            assert not moves.bulk_move_to(myunits, area1, area2, WID, PID)

            for unit1 in myunits:
                assert unit1.aid == area1.id
            for unit2 in tounits:
                assert unit2.aid == area2.id

            print("MOVE_INCASTLE_FAIL: Success")
        except (AssertionError) as e:
            print("MOVE_INCASTLE_FAIL: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_INCASTLE_FAIL: FailNE: {}".format(e))
            raise e

    def test_move_conquer(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'IE')
        tounits = self.app._units(area2.id, 'IE', [], 'to')

        try:
            assert moves.bulk_move_to(myunits, area1, area2, WID, PID)
            assert area2.iso == area1.iso
            for unit1 in myunits:
                assert unit1.aid == area2.id

            print("MOVE_CONQUER: Success")
        except (AssertionError) as e:
            print("MOVE_CONQUER: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_CONQUER: FailNE: {}".format(e))
            raise e

    def test_move_battle_fail(self):
        # from area
        area1 = self.app._area('area1', 'UK')
        myunits = self.app._units(area1.id, 'UK', [0,1,2,2])

        # to area
        area2 = self.app._area('area2', 'IE')
        tounits = self.app._units(area2.id, 'IE', [0,1,2,2], 'to')

        try:
            try:
                assert not moves.bulk_move_to(myunits, area1, area2, WID, PID)

            except GuardedAreaException:
                for unit1 in myunits:
                    assert unit1.aid == area1.id
                for unit2 in tounits:
                    assert unit2.aid == area2.id

                print("MOVE_BATTLE_FAIL: Success")
                return

            raise AssertionError()
        except (AssertionError) as e:
            print("MOVE_BATTLE_FAIL: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("MOVE_BATTLE_FAIL: FailNE: {}".format(e))
            raise e
