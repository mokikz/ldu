'use strict';
/* GET data requested. */
const debug = require('debug');
const log = debug('mokikz:datarouter');
const fs = require('fs');

const dataJs = function (req, res) {
  log('Hello from data router');
  const klasse = req.cookies.klasse;
  log('klasse = %s', klasse);
  // read class name from cookie if possible
  let dataFile = `${__dirname}/../public/data/${klasse}.js`;
  const defaultFile = `${__dirname}/../public/data/data.js`;
  log('data file = %s', dataFile);
  log('default file = %s', defaultFile);
  if (fs.existsSync(dataFile)) {
    log('sending data file: %s', dataFile);
  } else {
    log('sending default file %s', defaultFile);
    dataFile = defaultFile;
  }
  log('sending data file %s', dataFile);
  // this should be async, but hey, not teaching you that part here yet
  const fileJs = fs.readFileSync(dataFile);
  // res.setHeader('content-type', 'text/javascript');
  res.write(fileJs);
  res.end();
};

log('Library loaded');
module.exports = dataJs;
