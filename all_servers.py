import os
import signal
import subprocess
import time

bo = {}
apps = ['gameserver', 'wsgi']

for app in apps:
    print("  Starting {}".format(app))
    cmd = 'python {}.py'.format(app)
    bo[app] = subprocess.Popen(cmd)

    # The os.setsid() is passed in the argument preexec_fn so
    # it's run after the fork() and before  exec() to run the shell.

try:
    while 1:
        time.sleep(1)

except KeyboardInterrupt:
    print("Stopping servers")
    pass
except Exception as e:
    print('Exception', e)


for b in bo:
    os.system("taskkill /im make.exe")

    #os.killpg(os.getpgid(bo[b].pid), signal.SIGTERM)
