/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');

module.exports = {

  output: {
    path: 'dist/',
    filename: 'Carousel.js',
    library: "Carousel",
    libraryTarget: "umd"
  },

  debug: true,
  devtool: false,
  entry: './src/Carousel.js',

  stats: {
    colors: true,
    reasons: false
  },

  externals: [
    {
      "react": {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    }
  ],

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'jsx-loader'
    }]
  }
};
