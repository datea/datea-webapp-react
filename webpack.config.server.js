require('dotenv').config();
var webpack = require('webpack');
var path = require('path');
var SvgStore = require('webpack-svgstore-plugin');
var nodeExternals = require('webpack-node-externals');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var loaderRules = require('./webpack-loader-rules-server');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    target: 'node',
    externals: [nodeExternals({whitelist: ['react-select', 'react-select/dist/react-select.css']})],
    entry: {
      'server': path.resolve(__dirname, './src/server/index.js')
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'server.js',
      publicPath: '/',
      library: 'app',
      libraryTarget: 'commonjs2'
    },
    plugins: [
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(process.env.SERVER_API_URL_BUILD || 'https://api.datea.pe/api/v2'),
        MEDIA_URL: JSON.stringify(process.env.MEDIA_URL_BUILD || 'https://api.datea.pe'),
        WEB_URL: JSON.stringify(process.env.WEB_URL_BUILD || 'https://datea.pe'),
        ENV_TYPE : JSON.stringify('server')
      }),
      new webpack.LoaderOptionsPlugin({ debug: false}),
      new SvgStore({
        svgoOptions: {
          plugins: [{ removeTitle: true }]
        }
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new CopyWebpackPlugin([
        {
          from : path.resolve(__dirname, './src/server/run-server.js'),
          to : path.resolve(__dirname, './dist')
        },
        {
          from : path.resolve(__dirname, './package.json'),
          to: path.resolve(__dirname, './dist')
        },
        {
          from : path.resolve(__dirname, './yarn.lock'),
          to: path.resolve(__dirname, './dist')
        }
      ])
      //new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ],
    optimization: {
      minimize: false
    },
    module: {rules: loaderRules},
    bail: true
};
