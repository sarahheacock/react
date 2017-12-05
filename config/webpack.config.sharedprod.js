const paths = require('./paths');

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = Object.assign({
  name: "shared, output to ./node_modules",
  entry: {
    client: [require.resolve('./polyfills'), paths.sharedIndexJs]
  },
  output: {
    path: paths.appBuild,
    filename: "shared/index.js",
    library: "App",
    libraryTarget: 'umd',
    publicPath: paths.servedPath
  }
}, require('./webpack.config.baseprod.js')(paths.sharedSrc, 'shared'));
