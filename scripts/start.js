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
const { fork } = require('child_process');
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
  return build(previousFileSizes);
})
.then(({ stats, previousFileSizes, warnings }) => {
    clearConsole();
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

    run();
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


function run(){
  // The child_process.spawn() method spawns a new process using the given command,
  // with command line arguments in args. If omitted, args defaults to an empty array.
  let ready = false;
  const listen = fork('scripts/listen.js');

  listen.on('message', (m) => {
    console.log('Change in files: ', m);
    if(ready){
      //have to restart server and reload window
      //if you just reload window when changing client
      //client and server text will not match
      server.kill();
    }
  });

  let server;

  function run(){
    server = fork('build/server/index.js');

    server.on('message', (m) => {
      console.log('PARENT got message:', m.message);
      if(m.done){
        ready = true;
        openBrowser(urls.localUrlForBrowser);
      }
      else if(m.closed){
        console.log("closed");
      }
    });

    server.on('close', function(reason, description){
      //usually caused by reloading the browser
      console.log(reason, description);

      if(description === 'SIGTERM'){
        run();
      }
      else {
        listen.kill();
        process.exit(0);
      }
    });
  }

  run();
}
