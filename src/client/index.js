import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css';
import App from "../../build/shared";

/*PROD-START*/
import socket from './socket.js';

function add(){
  if(process.env.NODE_ENV === "development"){
    window.addEventListener('load', socket);
  }
}

add();
/*PROD-END*/

ReactDOM.hydrate(
  <Router>
    <App
      data={window.__PRELOADED_STATE__}
    />
  </Router>,
  document.getElementById('root')
);
