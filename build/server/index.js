'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _renderFullPage = require('./renderFullPage');

var _renderFullPage2 = _interopRequireDefault(_renderFullPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// import App from "../../build/shared";

var WebSocket = require('ws');

// import { renderToString } from 'react-dom/server';
// import React from 'react';
// import { StaticRouter } from 'react-router-dom';

var url = require('url');
var app = (0, _express2.default)();

app.use(_express2.default.static("build/client"));

//===============MIDDLEWARE=================================
var display = function display(req, res, next) {
  // res.json(req.data);
  // const body = renderToString(
  //   <StaticRouter context={{}} location={req.url}>
  //     <App data={req.data} />
  //   </StaticRouter>
  // );
  //
  var html = (0, _renderFullPage2.default)("", req.data);
  console.log(html);
  res.status(200).send(html);
};

//=================ROUTES====================================
app.get("/about", function (req, res, next) {
  req.data = {
    "name": "About"
  };
  next();
}, display);

app.get("*", function (req, res, next) {
  req.data = {
    "name": "Home"
  };
  next();
}, display);

//===========================================================
//==========================================================
//catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// const http = require('http');
// const server = http.createServer(app);
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
var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log("Express server is listening on port ", port);
});