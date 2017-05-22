var rules = [

  /********** JS ***********/
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use : {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets : [['es2015', {modules : false}], 'react', 'stage-0'],
        plugins : ['transform-decorators-legacy'] //, 'transform-runtime']
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
    test: /\.woff$|\.ttf$|\.eot$/,
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
          limit: 8192,
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
