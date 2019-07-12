import os

from sqlalchemy import text

from core.ctx import session, db_type, db_engine
from core.entities import Base


class MigrateCommand():
    def __init__(self, cli):
        self.commands = {
            'migrate': {
                'help': 'Run migrations for server',
                'short': {},
                'long': []
            }
        }

    def run(self, *args):
        base = 'cliapp/migrations/'+db_type+'/'
        files = os.listdir(base)

        conn = session.connection()

        # SQLAlchemy migration
        print("Applying SQLAlchemy migrations...")
        Base.metadata.create_all(db_engine)

        # SQL-based migrations
        for f in files:
            print('Applying migration {}...'.format(f))
            self.runMigration(conn, f)

    def runMigration(self, conn, f):
        base = 'cliapp/migrations/'+db_type+'/'

        with open(os.path.join(base, f), 'r') as sql_file:
            sql = text(sql_file.read())

        result = conn.execute(sql)

        session.commit()
        conn.close()

