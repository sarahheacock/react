import express from 'express';

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderFullPage from './routes/renderFullPage';
import App from '../components/App';

const app = express();


//===============MIDDLEWARE=================================
const display = (req, res, next) => {
  const html = renderToString(
    <StaticRouter context={{}} location={req.url}>
      <App data={req.data} />
    </StaticRouter>
  );

  res.status(200).send(renderFullPage(html, req.data));
}

//=================ROUTES====================================
app.get("/", (req, res, next) => {
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

//=======START SERVER========================================
const port = process.env.PORT || 8080;

http.createServer(app).listen(port, () => {
  console.log("Express server is listening on port ", port);
});
