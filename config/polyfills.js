if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
// require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
// if (process.env.NODE_ENV === 'test') {
//   require('raf').polyfill(global);
// }

// "build": "BABEL_ENV=production babel app -d build",
// "build:client": "NODE_ENV=production webpack --config ./config/webpack.config.prod.js/",
// "build:prod": "npm run build && npm run build:client",
// "build:watch": "BABEL_ENV=development babel app -d build --watch",
// "build:dev": "NODE_ENV=development webpack --config ./config/webpack.config.dev.js/",
// "build:watch:dev": "NODE_ENV=development webpack --config ./config/webpack.config.dev.js/ --watch",
// "start": "npm run build:prod && node ./build/server/index.js",
// "start:dev": "parallelshell 'npm run build:watch' 'npm run build:watch:dev' 'nodemon ./build/server/index.js'",
// "test": "jest --watch --coverage"

// ["env", {
//   "targets": {
//     "browsers": [
//       ">1%",
//       "last 4 versions",
//       "Firefox ESR",
//       "not ie < 9",
//     ]
//   }
// }],
// "react"
// ],
// "plugins": [
// [
//   "transform-runtime", {
//     "helpers": false,
//     "polyfill": false,
//     "regenerator": true,
//     "moduleName": "babel-runtime"
//   }
// ]
