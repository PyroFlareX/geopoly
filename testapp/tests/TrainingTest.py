from core.services import areas
from testapp.instances import webmock

class TrainingTest():
    def __init__(self, app):
        self.app = app

    def test_start(self):
        area = self.app._area('area1', 'UK')

        trains = {
            10: None,
            6: None,
            0: 1,
            1: 1,
            4: 2,
            2: 3,
            5: 5,
            3: 4,
            7: None,
            8: None,
            9: None,
            11: None,
        }

        for prof, lel in trains.items():
            areas.set_training(area, self.app.WID, prof)

            try:
                if lel:
                    assert area.training == prof
                    assert area.train_left == lel
                else:
                    assert area.training is None
                    assert area.train_left is None

                print("TRAIN_START: Success")
            except (AssertionError) as e:
                print("TRAIN_START: Fail({})".format(e.code if hasattr(e, 'code') else ''))
            except Exception as e:
                print("TRAIN_START: FailNE: {}".format(e))
                raise e

    def test_end(self):
        area = self.app._area('area1', 'UK')

        trains = {
            10: None,
            6: None,
            0: 1,
            1: 1,
            4: 2,
            2: 3,
            5: 5,
            3: 4,
            7: None,
            8: None,
            9: None,
            11: None,
        }

        try:
            for prof, lel in trains.items():
                if lel:
                    areas.set_training(area, self.app.WID, prof)

                    assert area.train_left is None

            print("TRAIN_START: Success")
        except (AssertionError) as e:
            print("TRAIN_START: Fail({})".format(e.code if hasattr(e, 'code') else ''))
        except Exception as e:
            print("TRAIN_START: FailNE: {}".format(e))
            raise e
