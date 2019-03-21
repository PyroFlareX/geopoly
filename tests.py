import sys


# same as if you were executing simple_website/webapp/website.py
# with working directory: simple_website
from testapp.tester import GeopolyTester

app = GeopolyTester()

args = sys.argv.copy()
args.pop(0)

if len(args) == 2:
    # run given testcase and test
    app.run(*args)
elif len(args) == 1:
    # run whole given testcase
    app.run(*args)
else:
    # run all testcases
    app.run()
