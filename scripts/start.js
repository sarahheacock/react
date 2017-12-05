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
const { fork, spawn } = require('child_process');
const webpack = require('webpack');
const paths = require('../config/paths');
// const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');
// const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  // choosePort,
  // prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(protocol, HOST, process.env.PORT);
const openBrowser = require('react-dev-utils/openBrowser');


// const sharedConfig = require('../config/webpack.config.shared-dev');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;



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
  // The child_process.fork() method is a special case of child_process.spawn() used specifically
  // to spawn new Node.js processes. Like child_process.spawn(), a ChildProcess object is returned.
  // The returned ChildProcess will have an additional communication channel built-in that allows
  // messages to be passed back and forth between the parent and child i.e. process.send({...});
  let server = {
    connected: false
  };
  const listen = fork('scripts/listen.js');

  listen.on('message', (m) => {
    // if you just reload window when changing client, client and server text will not match
    // therefore, you have to disconnect the server process causing window to reload
    function next(){
      if(server.connected){
        server.kill();
      }
      else {
        console.log(chalk.yellow("Server process not running"));
        console.log(chalk.green("Starting server process..."));
        console.log("");
        run();
      }
    }


    if(m.message){
      console.log(chalk.yellow(m.message));
      console.log("");
      next();
    }
    else if(m.request){
      let arr = m.request.split(' ');
      arr.splice(0, arr.indexOf("npm") + 1);

      console.log(chalk.yellow("npm", arr));
      console.log("");
      const npm = spawn('npm', arr);

      npm.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      npm.stderr.on('data', (data) => {
        console.log(chalk.red(`stderr: ${data}`));
      });

      npm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.log("");
        next();
      });
    }
  });

  listen.on('exit', (reason, description) => {
    console.log(chalk.red("Listener process stopped due to " +  description + " " + reason));
    console.log("");
  });

  listen.on('error', function(err){
    console.log(chalk.red("LISTENER PROCESS ERROR...", err));
    console.log("");
  })

  function run(){
    server = fork('build/server/index.js', [], {});

    server.on('message', (m) => {
      console.log(chalk.green(m.message));
      console.log("");

      if(m.done){
        openBrowser(urls.localUrlForBrowser);
      }
    });

    server.on('error', function(err){
      console.log(chalk.red("SERVER PROCESS ERROR...", err));
      console.log("");
    })

    server.on('exit', function(reason, description){
      // SIGTERM is the default signal of server.kill() which occurs on file changes
      if(description === 'SIGTERM'){
        console.log(chalk.green("Server process stopped due to " +  description + " " + reason));
        console.log(chalk.green("Restarting Server Process..."));
        console.log("");
        run();
      }
      else {
        // usually the other cause is 'null, 1' which is due to webpack compile error
        console.log("");
        console.log(chalk.red("Server process stopped due to " +  description + " " + reason));
        console.log("");
      }
    });
  }
}
