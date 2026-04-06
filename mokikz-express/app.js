'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
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

// Trust reverse-proxy headers (X-Forwarded-Proto) so req.secure works correctly
app.set('trust proxy', 1);

//routes
app.use(logger('dev'));

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' || req.secure) return next();
  res.redirect(301, 'https://' + req.headers.host + req.url);
});

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
  const { levels, metadata } = req.body;
  const content =
    'var metadata = ' + JSON.stringify(metadata || {}, null, 2) + ';\n' +
    'var levels = '   + JSON.stringify(levels,        null, 2) + ';\n';
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
  // Execute the template in a sandbox to extract its levels array.
  // Normalise const/let → var so vm exposes them on the sandbox object.
  const raw = fs.readFileSync(templateFile, 'utf8');
  const src = raw
    .replace(/\b(const|let)\s+levels\b/g,   'var levels')
    .replace(/\b(const|let)\s+metadata\b/g, 'var metadata');
  const sandbox = {};
  vm.createContext(sandbox);
  try { vm.runInContext(src, sandbox); } catch (e) {
    return res.status(500).json({ error: 'Vorlagendatei konnte nicht gelesen werden' });
  }
  const content =
    'var metadata = ' + JSON.stringify(req.body.metadata || {}, null, 2) + ';\n' +
    'var levels = '   + JSON.stringify(sandbox.levels   || [], null, 2) + ';\n';
  fs.writeFileSync(newFile, content);
  res.json({ ok: true });
});

// save a generated avatar PNG into public/images/
app.post('/api/save-avatar', (req, res) => {
  const { filename, dataUrl } = req.body;
  if (!filename || !/^[a-zA-Z0-9_ -]+\.png$/.test(filename)) {
    return res.status(400).json({ error: 'Ungültiger Dateiname' });
  }
  if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
    return res.status(400).json({ error: 'Ungültiges Bildformat' });
  }
  const buffer = Buffer.from(dataUrl.replace('data:image/png;base64,', ''), 'base64');
  if (buffer.length > 51200) {   // 100×100 PNG is well under 50 KB
    return res.status(400).json({ error: 'Bild zu groß' });
  }
  const avatarDir = path.join(__dirname, 'public', 'images', 'avatars');
  if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
  const imgFile = path.join(avatarDir, filename);
  fs.writeFileSync(imgFile, buffer);
  res.json({ ok: true, filename });
});

// list available data files
app.get('/api/data-files', (req, res) => {
  const dataDir = path.join(__dirname, 'public', 'data');
  const files = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''));
  res.json(files);
});

// list data files with their metadata
app.get('/api/data-files-metadata', (req, res) => {
  const dataDir = path.join(__dirname, 'public', 'data');
  const result = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.js'))
    .map(f => {
      const name = f.replace('.js', '');
      const raw = fs.readFileSync(path.join(dataDir, f), 'utf8');
      const src = raw
        .replace(/\b(const|let)\s+levels\b/g,   'var levels')
        .replace(/\b(const|let)\s+metadata\b/g, 'var metadata');
      const sandbox = {};
      vm.createContext(sandbox);
      try { vm.runInContext(src, sandbox); } catch (e) { /* ignore parse errors */ }
      return { file: name, metadata: sandbox.metadata || {} };
    });
  res.json(result);
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
