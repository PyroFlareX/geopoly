import os
from itertools import product

import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

from model import autoencoder, encoder, decoder, use_regularizer, encoding_dim, imX, imY, clearSession

# 32 floats -> compression factor 24.5, assuming the input is 784 floats

do_train = False
do_drawTest = False
do_drawRandom = True
do_drawScales = False
do_drawStatic = False


my_epochs = 2000

if use_regularizer:
    my_epochs *= 2







# prepare input data
x_all = []
for f in os.listdir('img'):
    im = Image.open('img/{}'.format(f))
    im.convert('RGB')
    pix = im.load()
    #parr = [ for a in im.getdata()]
    parr = [(sum(pix[x,y][0:3])/len(pix[x,y][0:3]))/255 for x,y in product(range(imX), range(imY))]
    x_all.append(parr)
x_all = np.array(x_all)
#np.random.shuffle(x_all)
#x_train, x_test = x_all[:12], x_all[12:]
x_train = x_all
x_test = x_all


# Train autoencoder
if do_train:
    autoencoder.fit(x_train, x_train, epochs=my_epochs, batch_size=256, shuffle=True, validation_data=(x_test, x_test), verbose=2)

    # after 50/100 epochs the autoencoder seems to reach a stable train/test lost value
    # save
    autoencoder.save_weights('weights/simple_autoencoder.h5')
else:
    print("Skipping train")
    autoencoder.load_weights('weights/simple_autoencoder.h5')

# Visualize the reconstructed encoded representations
if do_drawTest:
    encoded_imgs = encoder.predict(x_all)
    decoded_imgs = decoder.predict(encoded_imgs)

    n = len(x_all)  # how many digits we will display
    plt.figure(figsize=(10, 2), dpi=100)
    for i in range(n):
        # display original
        ax = plt.subplot(2, n, i + 1)
        plt.imshow(x_test[i].reshape(imX, imY).transpose())
        plt.gray()
        ax.set_axis_off()

        # display reconstruction
        ax = plt.subplot(2, n, i + n + 1)
        plt.imshow(decoded_imgs[i].reshape(imX, imY).transpose())
        plt.gray()
        ax.set_axis_off()

    plt.show()


elif do_drawRandom:
    encoded_imgs = encoder.predict(x_all)
    highs = encoded_imgs.max(axis=0)
    lows = encoded_imgs.min(axis=0)

    nR = 5; nC = 14
    nRnd = nR*nC
    encoded_rnd = np.zeros((nRnd, encoding_dim))

    for i in range(nRnd):
        for v in range(encoding_dim):
            encoded_rnd[i,v] = np.random.uniform(low=lows[v], high=highs[v])


    decoded_imgs = decoder.predict(encoded_rnd)

    # Draw randomized images
    plt.figure(figsize=(10, 2), dpi=100)
    i = 0
    for s in range(nRnd):
        i += 1
        # display original

        ax = plt.subplot(nR, nC, i)
        plt.imshow(decoded_imgs[s].reshape(imX, imY).transpose())
        plt.gray()
        ax.set_axis_off()
    plt.savefig("asd.png")
    plt.show()

elif do_drawStatic:

    encoded_rnd = np.array([
      [7.348493028530025, 13.86717800417588, 0.0, 0.0, 11.921106993502287, 31.894385594637296, 18.122741270603374, 33.85102705905622, 14.188113417228024, 0.0, 2.080152143804798, 0.0, 17.371111682951316, 32.56860031525094, 0.0, 14.201712773414332]
    ])

    decoded_imgs = decoder.predict(encoded_rnd)

    # Draw randomized images
    plt.figure(figsize=(10, 2), dpi=100)

    #ax = plt.subplot(1, 1, 0)
    plt.imshow(decoded_imgs[0].reshape(imX, imY).transpose())
    plt.gray()
    #ax.set_axis_off()

    plt.savefig("asd.png")
    plt.show()


elif do_drawScales:
    # print vectors
    encoded_imgs = encoder.predict(x_all)
    highs = encoded_imgs.max(axis=0)
    lows = encoded_imgs.min(axis=0)

    randomized = [
        False,  # 0.0000    2.8697
        False,  # 0.0046    13.9908
        False,  # 0.0000    0.0
        False,  # 6.6688    16.109
        False,  # 0.0000    0.0
        False,  # 0.0019    7.66929
        False,  # 0.0000    7.11298
        False,  # 0.0000    8.93195
        False,  # 1.2068    13.438
        False,  # 0.0000    0.0
        False,  # 0.0013    2.57398
        False,  # 11.133    20.8873
        False,  # 0.0009    3.68676
        False,  # 0.0000    0.0
        False,  # 13.858    28.3481
        False,  # 0.0024    2.68065
        False,  # 7.2240    21.7901
        False,  # 0.0000    0.0
        False,  # 0.0090    9.0936
        False,  # 3.6650    13.8807
        False,  # 0.0000    0.0
        False,  # 10.370    19.3957
        False,  # 2.1910    12.6702
        False,  # 8.5420    17.02159
        False,  # 7.4830    23.1518
        False,  # 0.0020    4.37669
        False,  # 0.0000    10.5074
        False,  # 0.3320    14.0356
        False,  # 0.0000    4.86273
        False,  # 0.0000    0.0
        False,  # 0.0390    4.86115
        False,  # 0.0060    6.91365
    ]

    nS = 16 # number of iterations on scaling

    x_ancestor = encoder.predict(x_all[0:1])[0]

    # Set matrix of scales to ancestor
    encoded_rnd = np.zeros((encoding_dim, nS, encoding_dim))
    for d in range(encoding_dim):
        for s in range(nS):
            for v in range(encoding_dim):
                encoded_rnd[d,s,v] = lows[v]

    # apply scaling values:
    for d in range(encoding_dim):
        d_min = lows[d]
        d_max = highs[d]

        for s in range(nS):
            # we scale on d dimension over s -> [0,1]
            px = float(s) / nS
            encoded_rnd[d,s,d] = px*(d_max-d_min) + d_min

    # Draw randomized images
    plt.figure(figsize=(10, 2), dpi=100)
    i = 0

    d_shown = []
    d_shown = [0,1,2,3,4,5,6,7]

    for d in d_shown:
        decoded_imgs = decoder.predict(encoded_rnd[d])

        for s in range(nS):
            i += 1
            # display original

            ax = plt.subplot(len(d_shown), nS, i)
            plt.imshow(decoded_imgs[s].reshape(imX, imY).transpose())
            plt.gray()
            ax.set_axis_off()

    plt.show()


clearSession()

# save latent space features 32-d vector
#pickle.dump(encoded_imgs, open(features_path, 'wb'))
#pickle.dump(y_test, open(labels_path, 'wb'))
