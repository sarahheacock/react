var path = require('path');
var fs = require('fs');
var url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}


var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp);

var envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

function getPublicUrl(appPackageJson) {
  return envPublicUrl || require(appPackageJson).homepage;
}

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  var publicUrl = getPublicUrl(appPackageJson);
  var servedUrl = envPublicUrl || (
    publicUrl ? url.parse(publicUrl).pathname : '/'
  );
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  appBuild: resolveApp('build'),
  nodeBuild: resolveApp('build/shared'),
  nodeFileBuild: resolveApp('node_modules/shared/main.js'),

  clientSrc: resolveApp('src/client'),
  clientIndexJs: resolveApp('src/client/index.js'),
  sharedSrc: resolveApp('src/shared'),
  sharedIndexJs: resolveApp('src/shared/App.js'),
  serverSrc: resolveApp('src/server'),
  serverIndexJs: resolveApp('src/server/index.js'),

  appHtml: resolveApp('public/index.html'),
  appPackageJson: resolveApp('package.json'),

  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths,
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};
