const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var rules = [

  /********** JS ***********/
  {
    test: /\.js$/,
    //exclude: /node_modules\/(?!(mobx-router)\/).*/,
    exclude: /node_modules/,
    use : {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        cacheDirectory: true,
        presets : [['env',{
          "targets": {
            "node": "current"
          }
        }], 'react'],
        plugins : [
          'transform-decorators-legacy',
          'transform-object-rest-spread',
          'transform-es2015-modules-commonjs',
          'transform-es2017-object-entries',
          'transform-es2015-destructuring',
          'transform-class-properties',
          'transform-export-extensions',
          ["module-resolver", {
            "alias": {
              "leaflet": "leaflet-headless",
              "leaflet.pm" : path.resolve(__dirname, './src/utils/empty'),
              'director/build/director' : 'director'
            },
            "extensions": [".js"]
          }]
          //'transform-optional-chaining'
        ]
      }
    }
  },

  /********** STYLE ***********/
  {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
  },
  {   // scss everything except react-toolbox
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader']
  },

  /********** FONTS ***********/
  {
    test: /\.woff$|\.woff2$|\.ttf$|\.eot$/,
    use: {
      loader: 'file-loader',
      options: {
        emitFile: false
      }
    }
  },

  /********** IMAGES ***********/
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
    use : [
      {
        loader : 'url-loader',
        options: {
          limit: 5120,
          hash : 'sha512',
          digest : 'hex',
          name : '[hash].[ext]'
        }
      },
      {
        loader : 'image-webpack-loader',
        options : {
          bypassOnDebug: true,
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 7
          }
        }
      }
    ]
  }
];

module.exports = rules;
