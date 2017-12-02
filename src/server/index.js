import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import App from "../../build/shared";

const WebSocket = require('ws');
const app = express();


app.use(express.static("build/client"));

const DEV = process.env.NODE_ENV === 'development';
//===============MIDDLEWARE=================================
//html that is returned during route changes
const renderFullPage = (html, preloadedState) => {
  const src = "./index.js";
  const href = '<link href="/index.css" rel="stylesheet"><link href="/shared.css" rel="stylesheet">';

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
let wss;

function init(){
  if(DEV){
    wss = new WebSocket.Server({ server });
    wss.on('connection', function connection(ws, req) {
      // const url = require('url');
      // const location = url.parse(req.url, true);
      // You might use location.query.access_token to authenticate or share sessions
      // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

      ws.on('message', function incoming(message) {
        console.log('received: ', message);
        let obj = {};
        obj[message] = true;
        process.send(obj);

        if(obj.kill || obj.reload){
          process.send(obj);

          server.close(function () {
            //ws.close();
            process.exit(0);
          });
        }
      });

      ws.on('close', function(reason, description){
        //usually caused by reloading the browser
        console.log((new Date()) + ' Peer disconnected. ' + reason + " " + description);
      });

      ws.send('HELLO');
    });
  }
}

init();

function send(){
  if(DEV){
    console.log('pid is ' + process.pid);
    const pid = process.pid;

    process.send({
      message: "Express server is listening on port: " + port + "\n pid: " + pid,
      done: true
    });
  }
}

//=======START SERVER========================================
const port = process.env.PORT || 8080;

server.listen(port, () => {
  //console.log();
  if(DEV){
    send();

    // if localhost is in use during dev
    // 'losof -i tcp:8080' in terminal to get PID
    // then 'kill -15 [PID]' or 'kill -9 [PID]'
    process.once('SIGINT', function() {  // ctrl C
      console.log("SIGINT");
      //let client know that it should not reload when it loses connection
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.on('close', function(){});
          client.send("kill");
        }
      });

      server.close(function(){
        process.exit(0);
      })
    });
  }
});
