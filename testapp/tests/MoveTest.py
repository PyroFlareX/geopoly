from random import choice

from core import game
from core.entities import Area
from core.exceptions import MoveException, AreaGuardedException
from core.rules import getMilPop
from core.services import turns, moves


class MoveTest():
    def __init__(self, app):
        self.app = app


    def _getBasePatch(self, area):
        base_patch = area.toView().copy()
        try:
            base_patch.pop('id')
            base_patch.pop('move_left')
            base_patch.pop('iso')
            base_patch.pop('mid')
        except:
            pass
        return base_patch


    def test_err_exhaust(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)
        move_patch = self._getBasePatch(afrom)

        moves.reset_areas([afrom, ato])
        afrom.move_left -= 10

        try:
            try:
                game.move_to(afrom, ato, move_patch)
                assert False
            except MoveException as e:
                assert e.reason == "has_moved"

            print("MOVE_EXHAUST: Success")
        except (AssertionError) as e:
            print("MOVE_EXHAUST: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(afrom.toView())
            print(ato.toView())

            print()

        except Exception as e:
            print("MOVE_EXHAUST: FailNE: {}".format(e))
            raise e

    def test_err_toomany(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)
        move_patch = self._getBasePatch(afrom)

        moves.reset_areas([afrom, ato])

        # just add 1 soldier too much:
        sol = choice(list(move_patch.keys()))
        move_patch[sol] += 1

        try:
            try:
                game.move_to(afrom, ato, move_patch)
                assert False
            except MoveException as e:
                assert e.reason == "not_enough_units"

            print("MOVE_TOO_MANY: Success")
        except (AssertionError) as e:
            print("MOVE_TOO_MANY: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(sol, "should be one too many")
            print(afrom.toView())
            print(ato.toView())

            print()

        except Exception as e:
            print("MOVE_TOO_MANY: FailNE: {}".format(e))
            raise e

    def test_err_nullinput(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)

        moves.reset_areas([afrom, ato])

        # Empty move patch:
        move_view_empty = ato.toView().copy()

        try:
            try:
                game.move_to(afrom, ato, move_view_empty)
                assert False
            except MoveException as e:
                assert e.reason == "bad_input"

            print("MOVE_NULLINPUT: Success")
        except (AssertionError) as e:
            print("MOVE_NULLINPUT: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(afrom.toView())
            print(ato.toView())

            print()

        except Exception as e:
            print("MOVE_NULLINPUT: FailNE: {}".format(e))
            raise e

    def test_err_neighbor(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)

        # todo: mock conn.json
        pass
        moves.reset_areas([afrom, ato])

        try:
            pass
            print("MOVE_ERRORS: Success")
        except (AssertionError) as e:
            print("MOVE_ERRORS: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(afrom.toView())
            print(ato.toView())

            print()

        except Exception as e:
            print("MOVE_ERRORS: FailNE: {}".format(e))
            raise e

    def test_guarded(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)

        move_patch = self._getBasePatch(afrom)
        moves.reset_areas([afrom, ato])

        # add just 1 guard to target area
        ato.cav_hussar = 1

        try:

            try:
                game.move_to(afrom, ato, move_patch)
                assert False
            except AreaGuardedException:
                pass

            print("MOVE_GUARDED: Success")

        except (AssertionError) as e:
            print("MOVE_GUARDED: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(afrom.toView())
            print(ato.toView())

        except Exception as e:
            print("MOVE_GUARDED: FailNE: {}".format(e))
            raise e

    def test_movesuccess(self):
        afrom: Area = self.app.readMock('area_move', Area)
        ato: Area = self.app.readMock('area_empty', Area)

        move_patch = self._getBasePatch(afrom)
        moves.reset_areas([afrom, ato])

        total_pop = getMilPop(afrom)

        try:
            assert getMilPop(afrom) == total_pop
            assert getMilPop(ato) == 0
            assert afrom.move_left == total_pop

            game.move_to(afrom, ato, move_patch)

            assert getMilPop(afrom) == 0
            assert getMilPop(ato) == total_pop
            assert afrom.move_left == 0

            print("MOVE_SIMPLE: Success")
        except (AssertionError, MoveException, AreaGuardedException) as e:
            print("MOVE_SIMPLE: Fail({})".format(e.code if hasattr(e, 'code') else ''))

            print(afrom.toView())
            print(ato.toView())

        except Exception as e:
            print("MOVE_SIMPLE: FailNE: {}".format(e))
            raise e
