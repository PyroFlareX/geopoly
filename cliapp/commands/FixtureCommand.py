import os
import uuid

from sqlalchemy import text

from core.dal.ctx import session, db_type
from core.factories.units import create_team
from core.instance import units


class FixtureCommand():
    def __init__(self, cli):
        self.commands = {
            'fixture': {
                'help': 'Run fixtures for server',
                'short': {},
                'long': []
            }
        }

    def run(self, *args):
        pid = '210845bf-8cc8-41b0-9049-583f0723e16a'
        wid = uuid.uuid4()
        iso = 'HU'
        aid = 'HU321'

        lunits = create_team(wid=wid, pid=pid, iso=iso, aid=aid)

        units.delete_all()
        units.save_all(lunits)
