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

const fs = require('fs-extra');
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
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(protocol, HOST, process.env.PORT);
const openBrowser = require('react-dev-utils/openBrowser');


// const sharedConfig = require('../config/webpack.config.shared-dev');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
// const parallel = require('parallel-webpack');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
// const isInteractive = process.stdout.isTTY;

measureFileSizesBeforeBuild(paths.appBuild)
.then(previousFileSizes => {
  clearConsole();
  //process.env.URL = urls.localUrlForBrowser;

  fs.emptyDirSync(paths.appBuild);
  //fs.removeSync(paths.nodeFileBuild);

  return build(previousFileSizes);
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

    const nodemon = exec('nodemon build/server/index.js');
    // This is to outpout in the terminal the child process
    nodemon.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    nodemon.on('exit', function (code) {
      console.log('nodemon process exited with code ' + code.toString());
    });

    process.env.URL = urls.localUrlForBrowser
    setTimeout(() => { openBrowser(process.env.URL) }, 1000);
});


// Create the production build and print the deployment instructions.
function build(previousFileSizes, config) {
  console.log('Creating development build...');

  return new Promise((resolve, reject) => {
    let shared = webpack(require('../config/webpack.config.shareddev'));
    shared.run((error, stat) => {
      if (error) {
        return reject(error);
      }
      let compiler = webpack(require('../config/webpack.config.dev'));

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
  });
}
