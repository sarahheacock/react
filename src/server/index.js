import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderFullPage from './renderFullPage';

import App from "shared";

// const WebSocket = require('ws');
// const url = require('url');
const app = express();

app.use(express.static("build/client"));

//===============MIDDLEWARE=================================
const display = (req, res, next) => {
  const body = renderToString(
    <StaticRouter context={{}} location={req.url}>
      <App data={req.data} />
    </StaticRouter>
  );

  const html = renderFullPage(body, req.data);
  console.log(html);
  res.status(200).send(html);
}

//=================ROUTES====================================
app.get("/", (req, res, next) => {
  //console.log(require("shared/main.css"));
  req.data = {
    "name": "Home"
  }
  next();
}, display);

app.get("/about", (req, res, next) => {
  req.data = {
    "name": "About"
  }
  next();
}, display);

//===========================================================
//==========================================================
//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const http = require('http');
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
//
//
// wss.on('connection', function connection(ws, req) {
//   const location = url.parse(req.url, true);
//   // You might use location.query.access_token to authenticate or share sessions
//   // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
//
//   ws.on('message', function incoming(message) {
//     console.log('received: ', message, location);
//   });
//
//   ws.send('HELLO');
// });


//=======START SERVER========================================
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Express server is listening on port ", port);
});
