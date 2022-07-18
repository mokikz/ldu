'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dataRouter = require('./routes/data');

const app = express();

let klasse = 'data';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/:klasse', (req, res, next) => {
  if (req.query.klasse) {
    //write klasse into cookie
    klasse = req.query.klasse;
  }
  res.cookie('klasse', klasse);
  next();
});

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/scripts/data.js', dataRouter);

// serving static application files
app.use(express.static(path.join(__dirname, 'public'), { index: ['mainframe.html'] }));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
