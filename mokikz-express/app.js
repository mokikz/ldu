var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

var app = express();

var klasse = 'data';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/:klasse', function (req, res, next) {
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
app.use(express.static(path.join(__dirname, 'public'), { 'index': ['mainframe.html'] }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;