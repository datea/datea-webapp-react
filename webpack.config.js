require('dotenv').config();
var webpack = require('webpack');
var path = require('path');
var SvgStore = require('webpack-svgstore-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var loaderRules = require('./webpack-loader-rules');
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
      'datea-web': ['babel-polyfill', path.resolve(__dirname, './src/client/index.js')],
    },
    output: {
        path: path.resolve(__dirname, './dist/client'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(process.env.API_URL_BUILD || 'https://api.datea.pe/api/v2'),
        MEDIA_URL: JSON.stringify(process.env.MEDIA_URL_BUILD || 'https://api.datea.pe'),
        WEB_URL: JSON.stringify(process.env.WEB_URL_BUILD || 'https://datea.pe'),
        ENV_TYPE : JSON.stringify('browser')
      }),
      new webpack.LoaderOptionsPlugin({ debug: false}),
      //new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'}),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/client/index-dev.html'),
        inject: 'body' // Inject all scripts into the body
      }),
      new SvgStore({
        svgoOptions: {
          plugins: [{ removeTitle: true }]
        }
      }),
      new CopyWebpackPlugin([
        {
          from : path.resolve(__dirname, './src/favicon.ico'),
          to : path.resolve(__dirname, './dist/client/')
        }
      ]),
    ],
    optimization: {
      minimize: true
    },
    module: {rules: loaderRules},
    bail: true,
    devtool: false
};
