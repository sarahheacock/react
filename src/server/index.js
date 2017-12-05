import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import App from "../../build/shared";


const app = express();
app.use(express.static("build/client"));

const DEV = process.env.NODE_ENV === 'development';

//===============MIDDLEWARE=================================
//html that is returned during route changes
const renderFullPage = (html, preloadedState) => {
  const src = "./index.js";
  const href = '<link href="/client.css" rel="stylesheet"><link href="/shared.css" rel="stylesheet">';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        ${href}
        <title>Your SSR React Router Node app initialized with data!</title>
      </head>
      <body>
        <div id="root">${html || 'Hello, World!'}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '||u003c')}
        </script>
        <script type="text/javascript" src="${src}"></script>
      </body>
    </html>
  `
}

// context object that is passed to StaticRouter
// It can modified by routes to provide additional info
// for server-side rendering
// context.url lets us know the app was redirected
const context = {};

//retrieve static route using react
const display = (req, res, next) => {
  console.log("Server received request: ", req.url);
  console.log("");

  const body = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App data={req.data} />
    </StaticRouter>
  );

  const html = renderFullPage(body, req.data);
  res.status(200).send(html);
}

//=================ROUTES====================================
app.get("/about", (req, res, next) => {
  req.data = {
    "name": "About"
  }
  next();
}, display);

// front end redirects routes to Home
app.get("*", (req, res, next) => {
  req.data = {
    "name": "HOME"
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

//================WEB SOCKET================================================
/*PROD-START*/
const WebSocket = require('ws');

let wss;

function init(){
  if(DEV){
    wss = new WebSocket.Server({ server });

    function count(){
      // both should equal 1 as long as no other tabs or browsers are open
      let open = 0;
      let total = 0;

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          open++;
        }
        total++;
      });

      return {
        open: open,
        total: total
      };
    }

    wss.on('connection', function connection(ws, req) {
      // const url = require('url');
      // const location = url.parse(req.url, true);

      ws.on('message', function incoming(message) {
        //console.dir(ws);
        const pid = ws._ultron.id; // increments every time the page is refreshed
        const num = count();
        process.send({message: message + "\nid: " + pid + "\nopen #: " + num.open + "\ntotal #: " + num.total});
      });

      ws.send('reload');
    });
  }
}

init();

function send(){
  if(DEV){
    const pid = process.pid;

    process.send({
      message: "Server process connected...\npid: " + pid + "\nExpress server is listening on port: " + port,
      done: true
    });
  }
}
/*PROD-END*/

//=======START SERVER========================================
const port = process.env.PORT || 8080;

server.listen(port, () => {
  /*PROD-START*/
  if(DEV){
    send();
    // if localhost is in use during dev 'losof -i tcp:8080' in terminal to get PID
    // then 'kill -15 [PID]' or 'kill -9 [PID]'
    process.once('SIGINT', function() {  // signal sent by ctrl C
      //let client know that it should not reload when it loses connection
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send("kill");
        }
      });

      console.log("SIGINT");
      server.close(function(){
        process.exit(0);
      });
    });
  }
  else {
    console.log("Express server is listening on port: " + port);
  }
  /*PROD-END*/
});
