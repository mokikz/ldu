'use strict';

var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var port = 3000;

serveStatic.index = false;

//server static files
//app.use(serveStatic(__dirname + "/public"));
app.use(serveStatic(__dirname + "/public", {'index': ['mainframe.html']}));

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
