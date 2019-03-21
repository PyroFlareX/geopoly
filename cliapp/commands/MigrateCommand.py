from sqlalchemy import text

from core.dal.ctx import session


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
        base = 'cliapp/migrations/{}.sql'

        conn = session.connection()

        for f in ['exts', 'users', 'servers', 'files', 'file_functions', 'add_servers']:
            print('Applying migration {}...'.format(f))
            with open(base.format(f), 'r') as sql_file:
                sql = text(sql_file.read())

            result = conn.execute(sql)

        session.commit()
        conn.close()
