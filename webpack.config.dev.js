var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var path              = require('path');
var fs                = require('fs');
var SvgStore          = require('webpack-svgstore-plugin');
var loaderRules       = require('./webpack-loader-rules');

var config = {
  devServer: {
    host: 'localhost',
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    port: 80
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    path.resolve(__dirname, './src/index-dev.js')
  ],
  output: {
    path: path.resolve(__dirname, './dev'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: { rules: loaderRules },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true}),
    new webpack.DefinePlugin({ __DEV__: 'true'}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // BETTER CONSOLE OUTPUT FOR ERRORS
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index-dev.html'),
      inject: 'body' // Inject all scripts into the body
    }),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }]
      }
    })
  ],
  devtool: 'eval-source-map'
  //devtool: 'eval'
};

module.exports = config;
