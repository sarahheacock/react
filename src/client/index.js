import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css';

import App from "shared";
import "shared/main.css";

// if(process.env.DEV !== "production"){
window.onload = require("./socket.js");
// }

ReactDOM.hydrate(
  <Router>
    <App
      data={window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
