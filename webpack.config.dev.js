require('dotenv').config();
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var path              = require('path');
var fs                = require('fs');
var SvgStore          = require('webpack-svgstore-plugin');
var loaderRules       = require('./webpack-loader-rules');

var config = {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    port: 9000
  },
  entry: ['babel-polyfill', path.resolve(__dirname, './src/client/index-dev.js')],
  output: {
    path: path.resolve(__dirname, './dev'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: { rules: loaderRules },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true}),
    new webpack.DefinePlugin({
      __DEV__: 'true',
      API_URL: JSON.stringify(process.env.API_URL_DEV || 'http://localhost:8000/api/v2'),
      MEDIA_URL : JSON.stringify(process.env.MEDIA_URL_DEV || 'http://localhost:8000'),
      WEB_URL: JSON.stringify(process.env.WEB_URL_DEV || 'http://localhost:9000'),
      ENV_TYPE : JSON.stringify('browser')
    }),
    new webpack.NamedModulesPlugin(), // BETTER CONSOLE OUTPUT FOR ERRORS
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/client/index-dev.html'),
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
