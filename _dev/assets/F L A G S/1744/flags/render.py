import json
from collections import OrderedDict, defaultdict
import os
import shutil
from math import ceil, sqrt
from itertools import product

from PIL import Image

images = OrderedDict()

eW = 240
eH = 160
eA = eW/eH
nX = 7
W = []
H = 0

fdir = 'flags_resized'
for f in sorted(os.listdir(fdir)):
    iso = os.path.splitext(os.path.basename(f))[0]
    filename = os.path.join(fdir, f)

    im = Image.open(filename)
    aspect = round(im.width/im.height,1)
    W.append(im.width)
    H = im.height

    if aspect != eA:
        raise Exception("aspect != {}".format(eA), aspect)
    images[iso] = im

if not all(w == eW for w in W):
    raise Exception("W != {}".format(eW))
if not H == eH:
    raise Exception("H != {}".format(eH))
W = W[0]

nY = ceil(len(images)/nX)

new_im = Image.new('RGBA', (W*nX, H*nY))
sizes = {
  'lg': 1.55,
  'md': 0.5,
  'sm': 0.25,
  'xs': 0.125
}
cssstr = """
.flag{{width:{}px; height:{}px;background: url(flags.png)}}
""".format(W, H)

for prefix, p in sizes.items():
    cssstr += ".flag-{0}{{zoom:{1};-moz-transform:scale({1});-moz-transform-origin: 0 0;}}\n".format(prefix, p)
cssstr += "\n\n"
x = 0; y = 0
isos = []

for iso, im in images.items():

    im2 = im.resize((W, H), Image.ANTIALIAS)
    new_im.paste(im2, (x*W,y*H))

    cssstr += ".flag-{}{{background-position: -{}px -{}px}}\n".format(iso,x*W,y*H)
    isos.append(iso)

    x += 1
    if x >= nX:
        x = 0
        y += 1
    if y >= nY:
        y = 0

new_im.save('flags.png')
with open("flags.css", "w") as fh:
    fh.write(cssstr)

print(json.dumps(isos))
