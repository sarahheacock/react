import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

// import './index.css';
import socket from './socket.js';
import App from "../../build/shared";
//import "shared/main.css";



window.onload = socket;

ReactDOM.hydrate(
  <Router>
    <App
      data={window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
