from itertools import product

from core.entities import Area
from core.rules import UNITS
from core.services.battle import getAttPoint, simulate_battle


def printMatrix(A):

    for row in A:
        str0 = ''.join(['{0:12.2f}'.format(item) if isinstance(item, float) else '{0:12}'.format(item) for item in row ])

        print(str0)

    print('\n'.join([]))


class BattleTest():
    def __init__(self, app):
        self.app = app

    def test_calculate(self):
        area_mixed1 = self.app.readMock('area_mixed', Area)
        area_mixed2 = self.app.readMock('area_mixed2x', Area)
        area_mixed3 = self.app.readMock('area_mixed3x', Area)

        area_att = area_mixed3
        area_def = area_mixed2

        patch = area_att.toUnitView()

        win, report_from, report_to = simulate_battle(area_att, area_def, patch)

        print("Successful attack" if win else "Successful defence")

        print(area_att.id, ' vs ', area_def.id)
        print("-- Strenght points:")
        print(report_from['strength'], '    ', report_to['strength'])
        print("-- Strength:")
        print(report_from['mils'], '    ', report_to['mils'])
        print("-- Casualties (+percent):")
        print(sum(report_from['loss'].values()), '    ', sum(report_to['loss'].values()))
        print(sum(report_from['loss'].values())*100/report_from['mils'], '    ', sum(report_to['loss'].values())*100/report_to['mils'])



    def test_pointweights(self):

        print("Testing class weights:")
        area_inf = self.app.readMock('area_inf', Area)
        area_cav = self.app.readMock('area_cav', Area)
        area_art = self.app.readMock('area_art', Area)
        area_mixed = self.app.readMock('area_mixed', Area)

        print('  inf -> inf', getAttPoint(area_inf, area_inf))
        print('  inf -> cav', getAttPoint(area_inf, area_cav))
        print('  inf -> art', getAttPoint(area_inf, area_art))
        print('  inf -> mix', getAttPoint(area_inf, area_mixed))
        print('')

        print('  cav -> inf', getAttPoint(area_cav, area_inf))
        print('  cav -> cav', getAttPoint(area_cav, area_cav))
        print('  cav -> art', getAttPoint(area_cav, area_art))
        print('  cav -> mix', getAttPoint(area_cav, area_mixed))
        print('')

        print('  art -> inf', getAttPoint(area_art, area_inf))
        print('  art -> cav', getAttPoint(area_art, area_cav))
        print('  art -> art', getAttPoint(area_art, area_art))
        print('  art -> mix', getAttPoint(area_art, area_mixed))
        print('')

    def test_weightmatrix(self):

        print("Unit weight Matrix:")
        
        matrix = []

        matrix.append(['att / def          '] + UNITS)

        for u1 in UNITS:
            area1 = Area()
            setattr(area1, u1, 1)
            
            arr = ['{:15}'.format(u1)]

            for u2 in UNITS:
                area2 = Area()
                setattr(area2, u2, 1)
                ap = getAttPoint(area1, area2)
                arr.append(ap)
            
            matrix.append(arr)
        
        printMatrix(matrix)
