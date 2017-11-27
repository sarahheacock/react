import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderFullPage from './renderFullPage';
// import http from 'http';

import * as App from "shared";

const fs = require('fs');
const WebSocket = require('ws');
const url = require('url');
// const reload = require('./reload.js');
const app = express();
//const DEV = (process.env.NODE_ENV === 'development') ? "src/client" : "build";
// let restart = false;
app.use(express.static("build/client"));

//===============MIDDLEWARE=================================
const display = (req, res, next) => {
  const html = renderToString(
    <StaticRouter context={{}} location={req.url}>
      <App.default data={req.data} />
    </StaticRouter>
  );

  const loaded = renderFullPage(html, req.data);
  console.log(loaded);
  res.status(200).send(loaded);
}

//=================ROUTES====================================
app.get("/", (req, res, next) => {
  console.log(App.default);
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

// app.get("/json", (req, res, next) => {
//
//   fs.readFile('reload.json', 'utf8', (err, d) => {
//     fs.writeFile('reload.json', '{"reload": "false"}', (err) => {
//       if (err) throw err;
//       res.json(JSON.parse(d));
//     });
//
//   });
// });
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

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');

  // fs.watchFile('reload.json', {encoding:'utf8'}, (curr, prev) => {
  //   fs.readFile('reload.json', 'utf8', (err, d) => {
  //     const data = JSON.parse(d);
  //
  //     console.log(data);
  //     if(data.reload === "true"){
  //       ws.send('reload');
  //     }
  //   });
  // });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 30000);


// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };

//=======START SERVER========================================
const port = process.env.PORT || 1337;

server.listen(port, () => {
  console.log("Express server is listening on port ", port);
});
