// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.PORT = 8080;
const HOST = process.env.HOST || '0.0.0.0';


// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const chalk = require('chalk');
const { exec } = require('child_process');
const webpack = require('webpack');
const paths = require('../config/paths');
// const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');
// const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(protocol, HOST, process.env.PORT);
const openBrowser = require('react-dev-utils/openBrowser');


// const sharedConfig = require('../config/webpack.config.shared-dev');
const clientConfig = require('../config/webpack.config.dev');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
// const parallel = require('parallel-webpack');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
// const isInteractive = process.stdout.isTTY;

measureFileSizesBeforeBuild(paths.appBuild)
// .then(previousFileSizes => {
//   // Remove all content but keep the directory so that
//   // if you're in it, you don't end up in Trash
//   // fs.emptyDirSync(paths.appBuild);
//   // Start the webpack build
//   return build(previousFileSizes, sharedConfig);
// })
.then(({ stats, previousFileSizes, warnings }) => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  //fs.emptyDirSync(paths.appBuild);
  // Start the webpack build
  return build(previousFileSizes, clientConfig);
})
.then(({ stats, previousFileSizes, warnings }) => {
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      );
    } else {
      console.log(chalk.green('Compiled successfully.\n'));
    }

    // console.log('File sizes after gzip:\n');
    // printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
    // console.log();
    // webpack([sharedConfig, clientConfig], (err, stats) => {
      // process.stdout.write(stats.toString() + "\n");
      // if(err){
      //   console.log(chalk.red('Failed to compile.\n'));
      //   console.log((err.message || err) + '\n');
      //   process.exit(1);
      // }
      const nodemon = exec('nodemon build/server/index.js');
      // This is to outpout in the terminal the child process
      nodemon.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      nodemon.on('exit', function (code) {
        console.log('nodemon process exited with code ' + code.toString());
      });
      //
      // console.log(chalk.yellow(`Starting the server on port ${process.env.PORT}...\n`));
      process.env.URL = urls.localUrlForBrowser
      setTimeout(() => { openBrowser(process.env.URL) }, 1000);
    // })
    //   parallel.run([sharedConfig], {
    //       watch: true,
    //       maxRetries: 1,
    //       stats: true, // defaults to false
    //       maxConcurrentWorkers: 2 // use 2 workers
    //   }, (err, stats) => {
    //
    // });

});


// Create the production build and print the deployment instructions.
function build(previousFileSizes, config) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.watch({
      aggregateTimeout: 300
    }, (err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (process.env.CI && messages.warnings.length) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}




// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
// choosePort(HOST, DEFAULT_PORT)
//   .then(port => {
//     if (port == null) {
//       // We have not found a port.
//       return;
//     }
//     const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//     const appName = require(paths.appPackageJson).name;
//     const urls = prepareUrls(protocol, HOST, port);
//     // Create a webpack compiler that is configured with custom messages.
//     const compiler = createCompiler(webpack, config, appName, urls, useYarn);
//     // Load proxy config
//     const proxySetting = require(paths.appPackageJson).proxy;
//     const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
//     // Serve webpack assets generated by the compiler over a web sever.
//     const serverConfig = createDevServerConfig(
//       proxyConfig,
//       urls.lanUrlForConfig
//     );
//     const devServer = new WebpackDevServer(compiler, serverConfig);
//     // Launch WebpackDevServer.
//     devServer.listen(port, HOST, err => {
//       if (err) {
//         return console.log(err);
//       }
//       if (isInteractive) {
//         clearConsole();
//       }
//       console.log(chalk.cyan('Starting the development server...\n'));
//       openBrowser(urls.localUrlForBrowser);
//     });
//
//     ['SIGINT', 'SIGTERM'].forEach(function(sig) {
//       process.on(sig, function() {
//         devServer.close();
//         process.exit();
//       });
//     });
//   })
//   .catch(err => {
//     if (err && err.message) {
//       console.log(err.message);
//     }
//     process.exit(1);
//   });
