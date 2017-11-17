import path from 'path';
import express from 'express';
import router from './routes/router';

const app = express();
const assets = express.static(path.join(__dirname, '../'));

app.use(assets);
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

app.listen(port, () => {
  console.log("Express server is listening on port ", port);
});
