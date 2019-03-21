import json
import csv
import base64
from shutil import copyfile
import csv

from flask import Flask, request, render_template


with open('editor.json') as fh:
    mode = json.load(fh)

def saveMode():
    with open('editor.json', 'w') as fh:
        json.dump(mode, fh)

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/setiso', methods=['POST'])
def setiso():
    data = request.get_json()
    
    mode[str(data.get('id'))] = data.get('iso')
    saveMode()

    return ''

@app.route('/removeiso', methods=['POST'])
def removeiso():
    data = request.get_json()
    
    del mode[str(data.get('id'))]
    saveMode()

    return ''

@app.route('/getmode')
def getmode():

    return json.dumps(mode)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, threaded=True)
