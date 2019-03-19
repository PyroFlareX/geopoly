import sys
from cliapp.cli import LaurenCommandLineInterface


app = LaurenCommandLineInterface()

if len(sys.argv) > 1:
    app.run(sys.argv)
else:
    app.start()
