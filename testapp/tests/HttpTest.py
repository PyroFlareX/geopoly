import uuid

from core.entities import Area, World
from core.exceptions import GuardedAreaException
from core.factories.units import create_team
from core.instance import worlds, units
from core.services import areas, moves
from testapp.instances import webmock

WID = uuid.UUID('12345678-1212-1212-1212-000000000000')
PID1 = uuid.UUID('00000000-0000-0000-0001-000000000000')
PID2 = uuid.UUID('00000000-0000-0000-0002-000000000000')
PID3 = uuid.UUID('00000000-0000-0000-0003-000000000000')


def uid(uid, N):
    return str(uid)[:-1] + str(N)

def uids(ud, rng):
    lst = []
    for i in rng:
        lst.append(uid(ud, i))
    return lst

class HttpTest():
    # simulate complete match with fictious map
    # apply mocked HTTP calls (with fix test WID,PID, etc)
    # and check database content in the end

    def __init__(self, app):
        self.app = app
        self.app.WID = WID

        areas.conn_graph = {
            "A1": ["B1", "A2"],
            "A2": ["A1", "B2", "A3"],
            "A3": ["A2", "B3"],
            "B1": ["A1", "C1", "B2"],
            "B2": ["A2", "C2", "B1", "B3"],
            "B3": ["B2", "A3", "C3"],
            "C1": ["B1", "C2"],
            "C2": ["B2", "C1", "C3"],
            "C3": ["B3", "C2"],
        }

    def test_fullmatch(self):
        err = None
        self._CreateMatch()

        try:
            self._step1()
            #self._step2()
            #self._step3()
            #self._step4()
            #self._step5()
            #self._step6()
            #self._step7()
            #self._step8()

            self._EndMatch()

            print("Full HTTP test: SUCCESS")
        except (AssertionError) as e:
            print("Full HTTP test: FAIL")
            err = e
        except Exception as e:
            print("Full HTTP test: FailNE: {}".format(e))
            raise e
        finally:
            print("  Clearing up test...")
            self._Deletematch()

            if err:
                raise err


    def _step1(self):
        """
        Send all lightcav and knights into foreign territory
        - 1 moves left
        - no conquer happened
        - no battle, health change, xp change, etc
        """

        webmock.call('Units:patch_move', {
            "units": uids(PID1, range(3, 9))
        })




    def _CreateMatch(self):
        try:
            world = worlds.get(WID)
            assert world is None

            ar = areas.areas.list_all(WID, as_dict=True)
            assert not ar
        except:
            self._Deletematch()

        print("  Creating match...")

        worlds.create(World(wid=WID, max_players=3, turns=0, turn_time=3600))

        areas.areas.save_all([
            Area(id='A1', iso='FR', pid=PID3, wid=WID, castle=0),
            Area(id='A2', iso='FR', pid=PID3, wid=WID, castle=4),
            Area(id='A3', iso='UK', pid=PID1, wid=WID, castle=0),
            Area(id='B1', iso='FR', pid=PID3, wid=WID, castle=2),
            Area(id='B2', iso='FR', pid=PID3, wid=WID, castle=0),
            Area(id='B3', iso='UK', pid=PID1, wid=WID, castle=4),
            Area(id='C1', iso='UK', pid=PID2, wid=WID, castle=0),
            Area(id='C2', iso='UK', pid=PID2, wid=WID, castle=4),
            Area(id='C3', iso='UK', pid=PID2, wid=WID, castle=0)
        ])

        # todo: itt: add units & users
        units.save_all(
            create_team(["HERO", "FOOT", "FOOT", "LIGHTCAV", "LIGHTCAV", "KNIGHT", "KNIGHT", "KNIGHT", "KNIGHT"], id_temp=uid(PID1, '{}'), iso='UK', aid='B3', wid=WID, pid=PID1)
        )
        units.save_all(
            create_team(["HERO", "DEFENDER", "DEFENDER", "LIGHTCAV"], id_temp=uid(PID3, '{}'), iso='FR', aid='A2', wid=WID, pid=PID3)
        )
        units.save_all(
            create_team(["DEFENDER", "DEFENDER", "FOOT"], id_temp=uid(PID2, '{}'), iso='UK', aid='C2', wid=WID, pid=PID2),
        )

        ar = areas.areas.list_all(WID, as_dict=True)

        # A1:
        assert ar['A1'].pid == PID3
        assert ar['A1'].iso == 'FR'
        assert ar['A1'].castle == 0
        assert ar['A1'].gold == 0

        # A2:
        assert ar['A2'].pid == PID3
        assert ar['A2'].iso == 'FR'
        assert ar['A2'].castle == 4
        assert ar['A2'].gold == 0

        # A3:
        assert ar['A3'].pid == PID1
        assert ar['A3'].iso == 'UK'
        assert ar['A3'].castle == 0
        assert ar['A3'].gold == 0

        # B1:
        assert ar['B1'].pid == PID3
        assert ar['B1'].iso == 'FR'
        assert ar['B1'].castle == 2
        assert ar['B1'].gold == 0

        # B2:
        assert ar['B2'].pid == PID3
        assert ar['B2'].iso == 'FR'
        assert ar['B2'].castle == 0
        assert ar['B2'].gold == 0

        # B3:
        assert ar['B3'].pid == PID1
        assert ar['B3'].iso == 'UK'
        assert ar['B3'].castle == 4
        assert ar['B3'].gold == 0

        # C1:
        assert ar['C1'].pid == PID2
        assert ar['C1'].iso == 'UK'
        assert ar['C1'].castle == 0
        assert ar['C1'].gold == 0

        # C2:
        assert ar['C2'].pid == PID2
        assert ar['C2'].iso == 'UK'
        assert ar['C2'].castle == 4
        assert ar['C2'].gold == 0

        # C3:
        assert ar['C3'].pid == PID2
        assert ar['C3'].iso == 'UK'
        assert ar['C3'].castle == 0
        assert ar['C3'].gold == 0


        units1 = units.list_by_area('B3', WID)
        for unit in units1:
            assert unit.aid == 'B3'
            assert unit.iso == 'UK'

        units2 = units.list_by_area('C2', WID)
        for unit in units2:
            assert unit.aid == 'C2'
            assert unit.iso == 'UK'

        units3 = units.list_by_area('A2', WID)
        for unit in units3:
            assert unit.aid == 'A2'
            assert unit.iso == 'FR'


    def _EndMatch(self):
        print("  Validating end result...")
        world = worlds.get(WID)

        ar = areas.areas.list_all(WID, as_dict=True)

        assert world.turns == 1

        # A1:
        assert ar['A1'].pid == PID3
        assert ar['A1'].iso == 'FR'
        assert ar['A1'].castle == 0
        assert ar['A1'].gold == 0

        # A2:
        assert ar['A2'].pid == PID3
        assert ar['A2'].iso == 'FR'
        assert ar['A2'].castle == 4
        assert ar['A2'].gold == 1

        # A3:
        assert ar['A3'].pid == PID1
        assert ar['A3'].iso == 'UK'
        assert ar['A3'].castle == 0
        assert ar['A3'].gold == 0

        # B1:
        assert ar['B1'].pid == PID3
        assert ar['B1'].iso == 'FR'
        assert ar['B1'].castle == 2
        assert ar['B1'].gold == 1

        # B2:
        assert ar['B2'].pid == PID1
        assert ar['B2'].iso == 'UK'
        assert ar['B3'].castle == 0
        assert ar['B3'].gold == 0

        # B3:
        assert ar['B3'].pid == PID1
        assert ar['B3'].iso == 'UK'
        assert ar['B2'].castle == 4
        assert ar['B2'].gold == 1

        # C1:
        assert ar['C1'].pid == PID2
        assert ar['C1'].iso == 'UK'
        assert ar['C1'].castle == 0
        assert ar['C1'].gold == 0

        # C2:
        assert ar['C2'].pid == PID1
        assert ar['C2'].iso == 'UK'
        assert ar['C2'].castle == 4
        assert ar['C2'].gold == 1

        # C3:
        assert ar['C3'].pid == PID2
        assert ar['C3'].iso == 'UK'
        assert ar['C3'].castle == 0
        assert ar['C3'].gold == 0

    def _Deletematch(self):
        world = worlds.get(WID)
        # clear up shit

        units.delete_world(WID)

        areas.areas.delete_world(WID)

        worlds.delete(world)
