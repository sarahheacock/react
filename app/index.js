import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dome'

import './index.css';
import App from './components/App';

render(
  <Router>
    <App
      pokemon={window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
