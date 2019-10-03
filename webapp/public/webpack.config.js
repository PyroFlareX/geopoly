var path = require('path');


module.exports = {
  mode: 'production',
  entry: {
    client: './client/client.js',
    //matchmaking: './client/main_matchmaking.js',
  },
  resolve: {
    alias: {
      '/client': path.resolve(__dirname, 'client/'),
      '/engine': path.resolve(__dirname, 'engine/'),
    }
  },
  output: {
    path: __dirname + "/js",
    filename: '[name].min.js',

    libraryExport: 'default',
    libraryTarget: 'umd',
    library: 'geopoly',
    globalObject: 'this',
  }
};
