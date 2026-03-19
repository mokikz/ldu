'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/mainframe.html');
});

module.exports = router;
