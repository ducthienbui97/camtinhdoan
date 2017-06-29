var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/'
  },
  module : {
    loaders : [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: /flexboxgrid/
      },
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          "presets": ["es2015", "react","stage-1"],
          "plugins": ["transform-decorators-legacy"]
        }

      }
    ]
  },
  devServer: {
      contentBase: BUILD_DIR,
      historyApiFallback: true
  }

};

module.exports = config;