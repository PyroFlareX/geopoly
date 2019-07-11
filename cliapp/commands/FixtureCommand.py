import os
import uuid

from sqlalchemy import text

from core.dal.ctx import session, db_type
from core.entities import World, Area
from core.factories.units import create_team
from core.instance import units, worlds
from core.services import areas


class FixtureCommand():
    def __init__(self, cli):
        self.commands = {
            'fixture:units': {
                'help': 'Run fixtures on units for server',
                'short': {},
                'long': []
            },
            'fixture:areas': {
                'help': 'Run fixtures on units for server',
                'short': {},
                'long': []
            }

        }

    def runUnits(self, *args):
        pid = '210845bf-8cc8-41b0-9049-583f0723e16a'
        iso = 'HU'
        aid = 'HU321'

        world = worlds.list_all()[0]

        #lunits = create_team(wid=world.wid, pid=pid, iso=iso, aid=aid)
        raise Exception("NOT IMPLEMENTED")
        #units.delete_all()
        #units.save_all(lunits)


    def runAreas(self, *args):
        world = worlds.list_all()[0]

        lareas = []
        for aid, feature in areas.features.items():
            area = Area(**feature['properties'])

            area.id = aid
            area.wid = world.wid
            lareas.append(area)

        areas.areas.save_all(lareas)
