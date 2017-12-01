'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _server = require('react-dom/server');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _shared = require('../../build/shared');

var _shared2 = _interopRequireDefault(_shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocket = require('ws');
var url = require('url');
var app = (0, _express2.default)();

app.use(_express2.default.static("build/client"));

//===============MIDDLEWARE=================================
var renderFullPage = function renderFullPage(html, preloadedState) {
  // const DEV = process.env.NODE_ENV === 'development';
  var src = "./index.js";
  var href = '<link href="/index.css" rel="stylesheet"><link href="/shared.css" rel="stylesheet">';

  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n        <meta name="theme-color" content="#000000">\n        ' + href + '\n        <title>Your SSR React Router Node app initialized with data!</title>\n      </head>\n      <body>\n        <div id="root">' + (html || 'Hello, World!') + '</div>\n        <script>\n          window.__PRELOADED_STATE__ = ' + JSON.stringify(preloadedState).replace(/</g, '||u003c') + '\n        </script>\n        <script type="text/javascript" src=' + src + '></script>\n      </body>\n    </html>\n  ';
};

var display = function display(req, res, next) {
  var body = (0, _server.renderToString)(_react2.default.createElement(
    _reactRouterDom.StaticRouter,
    { context: {}, location: req.url },
    _react2.default.createElement(_shared2.default, { data: req.data })
  ));

  var html = renderFullPage(body, req.data);
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

var http = require('http');
var server = http.createServer(app);

//================WEB SOCKET================================================
var wss = new WebSocket.Server({ server: server });
wss.on('connection', function connection(ws, req) {
  var location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: ', message, location);
    if (message === "close") {
      ws.close();
    }
  });

  ws.on('close', function (reason, description) {
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });

  ws.send('HELLO');
});

//=======START SERVER========================================
var port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log("Express server is listening on port ", port);
  console.log('pid is ' + process.pid);

  // SIGINT signal sent when ctrl C
  // if localhost is in use during dev
  // 'losof -i tcp:8080' in terminal to get PID
  // then 'kill -15 [PID]' or 'kill -9 [PID]'
  process.on('SIGINT', function () {
    console.log("Exiting...");

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("exit");
      }
    });

    server.close(function () {
      process.exit(0);
    });
  });
});