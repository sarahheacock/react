import path from 'path';
import express from 'express';
// import webpack from 'webpack';
// import webpackMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import config from '../../config/webpack.config.dev.js';

import { createServer } from 'http'
import router from './routes/router';

const app = express();
// const compiler = webpack(config);
const assets = express.static(path.join(__dirname, '../build'));

app.use(assets);
// app.use(webpackMiddleware(compiler));
// app.use(webpackHotMiddleware(compiler));
app.use(router);

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

//=======START SERVER========================================
const port = process.env.PORT || 8080;
const server = createServer(app);

server.listen(port, () => {
  console.log("Express server is listening on port ", port);
});
