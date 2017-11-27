import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css';
import * as App from "shared";


ReactDOM.hydrate(
  <Router>
    <App.default
      reload={window.__RELOAD__.reload}
      data={window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
