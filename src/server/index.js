import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderFullPage from './renderFullPage';
// import http from 'http';

import * as App from "shared";

const reload = require('./reload.js');
const app = express();
//const DEV = (process.env.NODE_ENV === 'development') ? "src/client" : "build";
let restart = false;
app.use(express.static("build/client"));

//===============MIDDLEWARE=================================
const display = (req, res, next) => {
  const html = renderToString(
    <StaticRouter context={{}} location={req.url}>
      <App.default data={req.data} />
    </StaticRouter>
  );

  console.log(restart);

  if(restart){
    restart = false;
    res.status(200).send(`<script>window.location.reload(true)</script>`);
  }
  else {
    restart = true;
    res.status(200).send(renderFullPage(html, req.data));
  }

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
//=======START SERVER========================================
const port = process.env.PORT || 8080;

// const io = require('socket.io')(server);
// io.on('connection', function(client){
//   console.log(client);
//   // io.emit('browserReload');
//   // client.on('connect', function(data){
//   //   console.log(data);
//   // });
//   // client.on('disconnect', function(){});
// });

server.listen(port, () => {
  // reload.toggle(true);
  const url = 'http://localhost:8080/';
  console.log(restart, require('./reload.js'));

  if(restart){
    http.get(url, (res) => {
      console.log("Express server is listening on port ", port, reload.reload);
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }
  else {
    restart = true;
  }

});
