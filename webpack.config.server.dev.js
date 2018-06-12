require('dotenv').config();
console.log(process.env.SERVER_API_URL_DEV);
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var path              = require('path');
var fs                = require('fs');
var SvgStore          = require('webpack-svgstore-plugin');
var nodeExternals     = require('webpack-node-externals');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var loaderRules       = require('./webpack-loader-rules-server');

var config = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals({whitelist: ['react-select', 'react-select/dist/react-select.css']})],
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    port: 9000
  },
  entry: [
    path.resolve(__dirname, './src/server/index.js')
  ],
  output: {
    path: path.resolve(__dirname, './dev'),
    filename: 'server.js',
    publicPath: '/',
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  module: { rules: loaderRules },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true}),
    new webpack.DefinePlugin({
      __DEV__: 'true',
      API_URL: JSON.stringify(process.env.SERVER_API_URL_DEV || 'http://localhost:8000/api/v2'),
      MEDIA_URL : JSON.stringify(process.env.MEDIA_URL_DEV || 'http://localhost:8000'),
      WEB_URL: JSON.stringify(process.env.WEB_URL_DEV || 'http://localhost:9000'),
      ENV_TYPE : JSON.stringify('server')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // BETTER CONSOLE OUTPUT FOR ERRORS
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }]
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devtool: 'eval-source-map'
  //devtool: 'eval'
};

module.exports = config;
