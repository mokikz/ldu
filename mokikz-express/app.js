'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
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
    // write klasse into cookie only when explicitly provided
    klasse = req.query.klasse;
    res.cookie('klasse', klasse);
  }
  next();
});

// save edited levels back to the data file
app.post('/api/save-data', (req, res) => {
  const klasse = req.cookies.klasse || 'data';
  // Reject anything that isn't a plain filename: no slashes, dots, or other
  // path-traversal characters that could reach files outside public/data/
  if (!/^[a-zA-Z0-9_ -]+$/.test(klasse)) {
    return res.status(400).json({ error: 'Invalid file name' });
  }
  // Only overwrite files that already exist in public/data/ — never create new ones
  const dataFile = path.join(__dirname, 'public', 'data', `${klasse}.js`);
  if (!fs.existsSync(dataFile)) {
    return res.status(404).json({ error: 'File not found: ' + klasse + '.js' });
  }
  // JSON.stringify always produces valid JSON literals — no free-form JS can
  // be injected through req.body regardless of its content
  const content = 'var levels = ' + JSON.stringify(req.body, null, 2) + ';\n';
  fs.writeFileSync(dataFile, content);
  res.json({ ok: true });
});

// create a new data file by copying a template
app.post('/api/create-data-file', (req, res) => {
  const { name, template } = req.body;
  if (!name || !/^[a-zA-Z0-9_ -]+$/.test(name)) {
    return res.status(400).json({ error: 'Ungültiger Dateiname' });
  }
  if (!template || !/^[a-zA-Z0-9_ -]+$/.test(template)) {
    return res.status(400).json({ error: 'Ungültige Vorlage' });
  }
  const dataDir = path.join(__dirname, 'public', 'data');
  const templateFile = path.join(dataDir, `${template}.js`);
  const newFile = path.join(dataDir, `${name}.js`);
  if (!fs.existsSync(templateFile)) {
    return res.status(404).json({ error: 'Vorlagendatei nicht gefunden' });
  }
  if (fs.existsSync(newFile)) {
    return res.status(409).json({ error: `${name}.js existiert bereits` });
  }
  fs.copyFileSync(templateFile, newFile);
  res.json({ ok: true });
});

// list available data files
app.get('/api/data-files', (req, res) => {
  const dataDir = path.join(__dirname, 'public', 'data');
  const files = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''));
  res.json(files);
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
