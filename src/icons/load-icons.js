let __svg__ = { path: './svg/**/*.svg', name: 'svg/[hash].icons.svg' };
// will overwrite to var __svg__ = { filename: "assets/svg/1466687804854.logos.svg" };

// also you can use next variables for sprite compile
// var __sprite__ = { path: './assets/svg/minify/*.svg', name: 'assets/svg/[hash].icons.svg' };
// var __svgstore__ = { path: './assets/svg/minify/*.svg', name: 'assets/svg/[hash].stuff.svg' };
// var __svgsprite__ = { path: './assets/svg/minify/*.svg', name: 'assets/svg/[hash].1logos.svg' };

// require basic or custom sprite loader
if (ENV_TYPE == 'browser') {
  require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);
}
