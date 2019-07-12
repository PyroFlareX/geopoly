import sys
from cliapp.cli import GeopolyCommandLineInterface


app = GeopolyCommandLineInterface()

if len(sys.argv) > 1:
    app.run(sys.argv)
else:
    app.start()
