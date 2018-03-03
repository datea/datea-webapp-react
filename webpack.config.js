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
      new webpack.LoaderOptionsPlugin({ debug: false}),
      new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'}),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        inject: 'body' // Inject all scripts into the body
      }),
      new SvgStore({
        svgoOptions: {
          plugins: [{ removeTitle: true }]
        }
      }),
      new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ],
    module: {rules: loaderRules},
    bail: false
};
