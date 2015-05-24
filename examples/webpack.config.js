var webpack = require('webpack');
module.exports = {

  output: {
    path: 'build/',
    filename: 'FadeCarousel.js'
  },

  debug: false,
  entry: './FadeCarousel.js',

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  stats: {
    colors: true,
    reasons: false
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'jsx-loader'
    }]
  }
};
