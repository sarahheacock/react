// const autoprefixer = require('autoprefixer');
const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.

module.exports = Object.assign({
  name: "shared, output to ./node_modules",
  // In production, we only want to load the polyfills and the app code.
  entry: {
    client: [require.resolve('./polyfills'), paths.sharedIndexJs]
  },
  output: {
    path: paths.appBuild,
    filename: "shared/index.js",
    library: "App",
    libraryTarget: 'umd',
    publicPath: '/',
    // devtoolModuleFilenameTemplate: info =>
    //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  }
}, require('./webpack.config.basedev.js')(paths.sharedSrc, 'shared'));
