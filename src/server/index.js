import express from 'express';

// import { renderToString } from 'react-dom/server';
// import React from 'react';
// import { StaticRouter } from 'react-router-dom';
//
// import App from "../../build/shared";

const WebSocket = require('ws');
const url = require('url');
const app = express();

app.use(express.static("build/client"));

//===============MIDDLEWARE=================================
const renderFullPage = (html, preloadedState) => {
  // const DEV = process.env.NODE_ENV === 'development';
  const src = "./index.js";
  const href = '';
  // '<link href="/index.css" rel="stylesheet">';
  // <script type="text/javascript" src="/socket.js"></script>

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
        <script type="text/javascript" src=${src}></script>
      </body>
    </html>
  `
}


const display = (req, res, next) => {
  // res.json(req.data);
  // const body = renderToString(
  //   <StaticRouter context={{}} location={req.url}>
  //     <App data={req.data} />
  //   </StaticRouter>
  // );
  //
  const html = renderFullPage("", req.data);
  console.log(html);
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
    "name": "Home"
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
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: ', message, location);
  });

  ws.send('HELLO');
});


//=======START SERVER========================================
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Express server is listening on port ", port);
});
