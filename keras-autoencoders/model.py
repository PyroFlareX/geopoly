from keras import backend as K
from keras.layers import Input, Dense
from keras.models import Model
from keras import regularizers


# Single fully-connected neural layer as encoder and decoder

imX = 32
imY = 48
encoding_dim = 16

use_regularizer = True
my_regularizer = None
features_path = 'simple_autoe_features.pickle'
#labels_path = 'simple_autoe_labels.pickle'

imL = imX * imY

if use_regularizer:
    # add a sparsity constraint on the encoded representations
    # note use of 10e-5 leads to blurred results
    my_regularizer = regularizers.l1(10e-8)
    # and a larger number of epochs as the added regularization the model
    # is less likely to overfit and can be trained longer
    features_path = 'sparse_autoe_features.pickle'
    #labels_path = 'sparse_autoe_labels.pickle'

# Models are taken from 'keras-autoencoders'

# Encoder
input_img = Input(shape=(imX*imY, ))

encoded = Dense(encoding_dim, activation='relu', activity_regularizer=my_regularizer)(input_img)
decoded = Dense(imX*imY, activation='sigmoid')(encoded)
autoencoder = Model(input_img, decoded)
encoder = Model(input_img, encoded)


# Separate Decoder model
encoded_input = Input(shape=(encoding_dim,))
decoder_layer = autoencoder.layers[-1]
decoder = Model(encoded_input, decoder_layer(encoded_input))


# configure model to use a per-pixel binary crossentropy loss, and the Adadelta optimizer
autoencoder.compile(optimizer='adadelta', loss='binary_crossentropy')


def clearSession():
    K.clear_session()
