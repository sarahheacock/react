const paths = require('./paths');

module.exports = [
  require('./webpack.config.shareddev.js'),
  Object.assign({
    name: "client side, output to ./build",
    // In production, we only want to load the polyfills and the app code.
    entry: {
      client: [require.resolve('./polyfills'), paths.clientIndexJs]
    },
    output: {
      path: paths.appBuild,
      filename: 'client/index.js',
      publicPath: '/',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: info =>
      //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    }
  }, require('./webpack.config.basedev.js')(paths.clientSrc, 'client')),
  Object.assign({
    // eslint-disable-next-line
    name: "server, output to ./build",
    // In production, we only want to load the polyfills and the app code.
    entry: {
      server: [require.resolve('./polyfills'), paths.serverIndexJs]
    },
    output: {
      path: paths.appBuild,
      filename: 'server/index.js',
      publicPath: '/',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: info =>
      //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    target: 'node',
  }, require('./webpack.config.basedev.js')(paths.serverSrc, ''))
];
