import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css';
import App from "shared";
//import App from '../build/static/js/app.68bc2f3b.js'
// import path from 'path';


// const str = path.join('../../build', require('../../build/asset-manifest.json')["app.js"]);
// const App = require(path.resolve(__dirname, str));

ReactDOM.hydrate(
  <Router>
    <App
      data={(!window) ? {name: ''} :window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
