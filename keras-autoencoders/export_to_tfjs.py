import tensorflowjs as tfjs

from model import autoencoder, decoder

"""
    This exports the trained model to tensorflow.js
"""

autoencoder.load_weights('weights/simple_autoencoder.h5')


tfjs.converters.save_keras_model(decoder, "../webapp/public/keras/")
