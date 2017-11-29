// const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
// const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);
// Source maps are resource heavy and can cause out of memory issue for large source files.
// const shouldUseRelativeAssetPaths = publicPath === './';
//const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';


// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
// if (env.stringified['process.env'].NODE_ENV !== '"development"') {
//   throw new Error('Production builds must have NODE_ENV=development.');
// }

// Note: defined here because it will be used more than once.
const cssFilename = 'main.css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = { publicPath: Array(cssFilename.split('/').length).join('../') }

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
    name: "shared, output to ./node_modules",
    devtool: "eval-source-map",
    // In production, we only want to load the polyfills and the app code.
    entry: {
      client: [require.resolve('./polyfills'), paths.sharedIndexJs]
    },
    output: {
      path: paths.nodeBuild,
      filename: "main.js",
      library: "App",
      libraryTarget: 'umd',
      publicPath: publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: info =>
      //   path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      alias: {

        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.sharedSrc, [paths.appPackageJson]),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // TODO: Disable require.ensure as it's not a standard language feature.
        // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
        // { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          test: /\.(js|jsx|mjs)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: eslintFormatter,
                eslintPath: require.resolve('eslint'),

              },
              loader: require.resolve('eslint-loader'),
            }
          ],
          include: paths.sharedSrc,
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process JS with Babel.
            {
              test: /\.(js|jsx|mjs)$/,
              include: paths.sharedSrc,
              loader: require.resolve('babel-loader'),
              options: {

                compact: true,
              },
            },
            {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract(
                Object.assign(
                  {
                    fallback: {
                      loader: require.resolve('style-loader'),
                      options: {
                        hmr: false,
                      }
                    },
                    use: [
                      {
                        loader: require.resolve('css-loader'),
                        options: {
                          importLoaders: 1,
                        },
                      },
                      require.resolve('postcss-loader')
                    ]
                  },
                  extractTextPluginOptions
                )
              )
            },
          ],
        },
      ],
    },
    plugins: [
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV was set to production here.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      new webpack.DefinePlugin({
        'process.env.LOAD': true,
      }),
      new ExtractTextPlugin({
        filename: cssFilename,
      }),
    ],
  };
