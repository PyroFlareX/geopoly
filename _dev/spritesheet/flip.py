import os
from collections import defaultdict

from PIL import Image


fdir = 'map'
odir = 'map_extend'
W = 42
H = 50

x_corrs = defaultdict(int)
x_corrs['Unit00.png'] = -10
x_corrs['Unit01.png'] = 5
x_corrs['Unit03.png'] = 2
x_corrs['Unit91.png'] = 2


for f in sorted(os.listdir(fdir)):
    filename = os.path.join(fdir, f)
    im = Image.open(filename)

    # paste img
    new_im = Image.new('RGBA', (256, 256+3*H))
    new_im.paste(im, (0, 0))

    # paste and flip other side
    for j in range(1, 4):
        y = j * H

        for i in range(0, 6):
            x = i * W
            top_part = im.crop((x,y,x+W,y+H))
            top_part = top_part.transpose(Image.FLIP_LEFT_RIGHT)

            #top_part.save(odir+"/"+str(i)+".png")
            new_im.paste(top_part, (x+x_corrs[f], y+4*H))

    new_im.save(odir+"/"+f)
