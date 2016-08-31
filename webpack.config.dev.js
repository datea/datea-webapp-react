var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var path              = require('path');
var fs                = require('fs');
var SvgStore          = require('webpack-svgstore-plugin');

var config = {
  devServer: {
      historyApiFallback: true,
  },
  entry: ['babel-polyfill', 'webpack/hot/dev-server', path.resolve(__dirname, './src/App.js')],
  output: {
    path: path.resolve(__dirname, './dev'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  eslint: {
    reporter: require("eslint-friendly-formatter"),
    // reporter: require("eslint/lib/formatters/stylish")
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'babel?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=react-hmre&plugins[]=transform-decorators-legacy'
        // add 'eslint' if you want
      ],
      exclude: /node_modules/
    }, {
      test: /\.scss$|\.css$/,
      loader: 'style!css!sass'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.woff$|\.ttf$|\.eot$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
      loaders: [
        'url?limit=8192&hash=sha512&digest=hex&name=[hash].[ext]',
        'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: 'true'
    }),
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
  debug : true,
  devtool: 'eval-source-map'
  //devtool: 'eval'
};

module.exports = config;
