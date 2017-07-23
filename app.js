'use strict';

var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var port = 3000;
var url = require('url');

// redirect index.html to jimdo homepage
app.use(function (req, res, next){
  if ((url.parse(req.url).pathname == '/')||
     (url.parse(req.url).pathname == '/index.html')) {
    res.writeHead(301, {Location: 'https://mokikz.jimdo.com/'});
    res.end();
  }
  else {
    next();
  }
});

// send filtered data.js according to url options
app.use(function (req, res, next){
    next();
});

//server static files
app.use(serveStatic(__dirname + "/public"));

app.use(function (req, res, next) {
  console.log(req.method + ': ' + req.url);
  next();
});

var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(port, function() {
  console.log("Server listening on port " + port);
});


io.on('connection', function (socket) {
  console.log("new connection");
  socket.on('question', function (data) {
    console.log("received question event ");
    console.log(data);
  });
});
