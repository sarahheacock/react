// const path = require('path');
// const fs = require('fs');
//
// const appDirectory = fs.realpathSync(process.cwd());
// function resolveApp(relativePath) {
//   return path.resolve(appDirectory, relativePath);
// }

const renderFullPage = (html, preloadedState) => {
  //get rid of script tags .replace(/</g, '||u003c') to prevent dangerous injection
  //bundle.js sits in the build folder
  //<style type="text/css">${[...css].join('')}</style>
  //fs.readFile('build/asset-manifest.json', (req, res, next) => {})
  // <script async src="${resolveApp('build/static/js/main.3d88b102.js')}"></script>
  // <link href="${resolveApp('build/static/css/main.ef8ab871.css')}" rel="stylesheet">
  return `
    <!doctype html>
    <html>
      <head>
        <title>Your SSR React Router Node app initialized with data!</title>
        <link href="/static/css/client.css" rel="stylesheet">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '||u003c')}
        </script>
        <script type="text/javascript" src="/static/js/client.js"></script>
      </body>
    </html>
  `
}

export default renderFullPage;
