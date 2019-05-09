import os

from sqlalchemy import text

from core.dal.ctx import session, db_type


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

        conn = session.connection()

        for f in os.listdir(base):
            print('Applying migration {}...'.format(f))

            with open(os.path.join(base,f), 'r') as sql_file:
                sql = text(sql_file.read())

            result = conn.execute(sql)

        session.commit()
        conn.close()
