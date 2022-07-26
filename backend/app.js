require('dotenv').config();
const express = require('express');

const createError = require('http-errors');
const logger = require('morgan');

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', userRouter);

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
