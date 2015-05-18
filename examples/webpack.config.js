module.exports = {

  output: {
    path: 'build/',
    filename: 'FadeCarousel.js'
  },

  debug: true,
  entry: './FadeCarousel.js',

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
