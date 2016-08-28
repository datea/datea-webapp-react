var webpack = require('webpack');
var path = require('path');
var SvgStore = require('webpack-svgstore-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      'datea-web': ['babel-polyfill', path.resolve(__dirname, './src/App.js')]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('common.js'),
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        inject: 'body' // Inject all scripts into the body
      }),
      new SvgStore({
        svgoOptions: {
          plugins: [{ removeTitle: true }]
        }
      })
    ],
    module: {
        /*preLoaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint?{rules:{"no-unused-vars": [0]}}'
        }],*/
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel?presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=transform-decorators-legacy&plugins[]=transform-runtime'
        },{
          test: /\.css$/,
          loader: "style!css"
        },{
            test: /\.scss$/,
            loader: 'style!css!sass'
        },{
            test: /\.json$/,
            loader: 'json-loader'
        },{
          test: /\.woff$|\.ttf$|\.eot$/,
          loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
        },{
          test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
          loaders: [
            'url?limit=8192&hash=sha512&digest=hex&name=img/[hash].[ext]',
            'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        }
      ]
    },
    bail: false
};
