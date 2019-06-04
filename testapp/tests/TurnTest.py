from core.services import turns

class TurnTest():
    def __init__(self, app):
        self.app = app

    def test_1user(self):
        match: Match = self.app.readMock('turns_1user', Match)
        iso = match.isos[0]

        turns.init(match)

        try:
            new = turns.next_turn(match)

            assert new == iso

            print("1 USER TURN: Success")
        except (AssertionError) as e:

            print("1 USER TURN: Fail")

        except Exception as e:
            print("1 USER TURN: FailNE: {}".format(e))
            raise e


    def test_1round(self):
        match: Match = self.app.readMock('turns_match', Match)

        plIds = match.isos.copy()
        turns.init(match)

        i = None
        new = None
        curr = None
        old_turns = match.turns

        try:
            for i in range(0, len(plIds)):
                assert match.rounds == 1

                curr = match.current
                new = turns.next_turn(match)

                assert match.turns == old_turns + 1
                assert curr in plIds
                assert match.isos.index(curr) == i
                assert not curr == new
                assert match.turns == i+2  # +2 because we call next in advance!


                old_turns = match.turns
            i = 'end'
            curr = match.current
            assert curr is None

            print("ENDTURN: Success")
        except (AssertionError) as e:
            print("ENDTURN: Fail({})".format(e.code if hasattr(e, 'code')else''))
            print('  In turn:', i)
            print('  >Is', match.turns, '==', old_turns + 1)
            print('  >Is', curr, 'in', plIds)
            print('  >Is', match.isos.index(curr), '==', i)
            print('  >Is', curr, '!=', new)
            print('  >Is', match.turns, '==', i+2)

            print(match.toView())

        except Exception as e:
            print("ENDTURN: FailNE: {}".format(e))
            raise e

    def test_cycle(self):
        match: Match = self.app.readMock('turns_match', Match)
        plIds = match.isos.copy()
        turns.init(match)

        i = None
        new = None
        curr = None; curr0 = None

        try:
            # make 3 full rounds
            for i in range(0, len(plIds)*3-1):
                curr0 = match.current

                assert match.rounds == int(i/3)+1
                assert curr0 == match.isos[i%3]
                new, is_new_round = self.endTurn(match)

                assert new != -1

                if i % 3 == 2:
                    assert is_new_round
                else:
                   assert not is_new_round

                curr = match.current
                assert curr in plIds
                assert match.turns == i+2 # +2 because we call next in advance!
                assert match.isos.index(curr) == (i+1)%3
            i = 'end'

            print("CYCLIC: Success")
        except (AssertionError) as e:
            print("CYCLIC: Fail({})".format(e.code if hasattr(e, 'code')else''))
            print('  In turn:', i)
            print('  >Is', match.rounds, '==', i+1)
            print('  >Is', curr0, '==', match.isos[i%3])
            print('  >Is', new, '!=', -1)
            print('  >Is new round:', is_new_round)
            print('  >Is', curr, 'in', plIds)
            print('  >Is', match.turns, '==', i+2)

            if curr is not None:
                print('  >Is', match.isos.index(curr), '==', (i+1)%3)

        except Exception as e:
            print("CYCLIC: FailNE: {}".format(e))
            raise e

    def endTurn(self, match):
        new = turns.next_turn(match)

        if new is None:
            turns.reset_round(match)

            return match.current, True

        return new, False
