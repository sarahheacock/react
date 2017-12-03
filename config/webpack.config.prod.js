// const autoprefixer = require('autoprefixer');
const paths = require('./paths');

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = [
  Object.assign({
    name: "client side, output to ./build",
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    // In production, we only want to load the polyfills and the app code.
    entry: {
      client: [require.resolve('./polyfills'), paths.clientIndexJs]
    },
    output: {
      // The build folder.
      path: paths.appBuild,
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      filename: 'client/index.js',
      //chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.servedPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: info =>
      // path
      //   .relative(paths.clientSrc, info.absoluteResourcePath)
      //   .replace(/\\/g, '/'),
    }
  }, require('./webpack.config.baseprod.js')(paths.clientSrc, 'client')),
  // BUNDELED SERVER HAS NOT SUCCESSFULLY WORKED ON herokuapp
  // CURRENTLY--INSTEAD OF RUNNING COMPILER, WE ARE RUNNING 'babel ./src/server -d build/server'

  Object.assign({
    name: "server, output to ./build",
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    target: 'node',
    // In production, we only want to load the polyfills and the app code.
    entry: {
      server: [require.resolve('./polyfills'), paths.serverIndexJs]
    },
    output: {
      // The build folder.
      path: paths.appBuild,
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      filename: 'server/index.js',
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.servedPath
    }
  }, require('./webpack.config.baseprod.js')(paths.serverSrc, ''))
];
