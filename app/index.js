import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/App';
//import App from '../build/static/js/app.68bc2f3b.js'
import './index.css';

ReactDOM.hydrate(
  <Router>
    <App
      data={(!window) ? {name: ''} :window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
