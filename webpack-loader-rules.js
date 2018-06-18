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
            "browsers": ["last 2 versions"]
          }
        }], 'react'],
        plugins : [
          'transform-decorators-legacy',
          'transform-object-rest-spread',
          'transform-es2015-modules-commonjs',
          'transform-es2017-object-entries',
          'transform-es2015-destructuring',
          'transform-class-properties',
          'fast-async',
          'transform-export-extensions',
          //'transform-optional-chaining'
        ]
      }
    }
  },

  /********** STYLE ***********/
  {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
  },
  {   // scss everything except react-toolbox
      test: /\.scss$/,
      exclude: /(node_modules)\/react-toolbox/,
      use: ['style-loader', 'css-loader','sass-loader']
  },
  {   // scss only react-toolbox
      test    : /(\.scss|\.css)$/,
      include : /(node_modules)\/react-toolbox/,
      use : [
        'style-loader',
        {loader: 'css-loader', options: {modules: true}},
        'sass-loader'
      ]
  },

  /********** FONTS ***********/
  {
    test: /\.woff$|\.woff2$|\.ttf$|\.eot$/,
    use: {
      loader: 'file-loader',
      options : {
        name: 'fonts/[name].[ext]'
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
