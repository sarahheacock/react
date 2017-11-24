import express from 'express';

import http from 'http';
import path from 'path';

const app = express();

app.use(express.static('build'));

// Answer API requests.
//=================ROUTES====================================
// app.get("/", (req, res, next) => {
//   req.data = {
//     "name": "Home"
//   }
//   next();
// });
//
// app.get("/about", (req, res, next) => {
//   req.data = {
//     "name": "About"
//   }
//   next();
// });

app.get('*', function(request, response) {
  response.sendFile('index.html');
});

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

//const http = require('http');

//=======START SERVER========================================
const port = process.env.PORT || 8080;

http.createServer(app).listen(port, () => {
  console.log("Express server is listening on port ", port);
});
