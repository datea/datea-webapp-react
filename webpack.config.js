require('dotenv').config();
var webpack = require('webpack');
var path = require('path');
var SvgStore = require('webpack-svgstore-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var loaderRules = require('./webpack-loader-rules');

module.exports = {
    mode: 'production',
    entry: {
      'datea-web': ['babel-polyfill', path.resolve(__dirname, './src/index.js')]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(process.env.API_URL_BUILD || 'https://api.datea.pe/api/v2'),
        MEDIA_URL: JSON.stringify(process.env.MEDIA_URL_BUILD || 'https://api.datea.pe'),
        WEB_URL: JSON.stringify(process.env.WEB_URL_BUILD || 'https://datea.pe')
      }),
      new webpack.LoaderOptionsPlugin({ debug: false}),
      //new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'}),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index-dev.html'),
        inject: 'body' // Inject all scripts into the body
      }),
      new SvgStore({
        svgoOptions: {
          plugins: [{ removeTitle: true }]
        }
      }),
      //new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ],
    optimization: {
      minimize: true
    },
    module: {rules: loaderRules},
    bail: false
};
