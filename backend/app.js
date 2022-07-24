const cors = require("cors");
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.json({'error': err.message, 'status': err.status || 500});
});

module.exports = app;
