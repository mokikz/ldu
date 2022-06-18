'use strict';
// Include fs module
const fs = require('fs');
var util = require('util');
var http = require('http');
var connect = require('connect');
var Cookies = require('cookies');
var serveStatic = require('serve-static');
var app = connect();
var port = 3000;
var klasse = "data"
serveStatic.index = false;

//enable cookie handling
//app.use (cookie.express(req,res));

// set cookie param if initially calles with individual class name
// so we can pick data file for this class afterwards
app.use(function(req, res, next) {
  //console.log("found URL: " + util.inspect(req.originalUrl));
  var myUrl = req._parsedUrl;
  var query = myUrl.query;
  if (query) {
  var re = new RegExp("klasse=([a-zA-Z0-9]*)");
  var urlKlasse = query.match(re);
  if (urlKlasse) {
     klasse = urlKlasse[1].toLowerCase();
     console.log("write klasse into cookie");
     var cookie = new Cookies(req, res);
     cookie.set('klasse', klasse);
     }
  }
  //var headers = req.headers;
  //var myUrl = new URL(req.uri);
  //console.log("found URL: " + util.inspect(myUrl));
  //var urlKllasse = myURL.searchParams.get('klasse');
  //console.log('klasse: ' + urlKlasse);
  //if (urlKlasse) {
 //     klasse = urlKlasse.toLowerCase();
  //    console.log("write klasse into cookie");
   //   res.cookie('MoKiKZ',12345, { 'klasse' : klasse });
  //}
  next();
}); 

//pick data file for given school class
//or default if no class given
app.use('/scripts/data.js', function(req, res, next) {

    // read class name from cookie if possible
    var dataFile = __dirname + "/public/data/" + klasse + ".js" ;
    var defaultFile = __dirname + "/public/data/data.js" ;

    if (fs.existsSync(dataFile)) {
        console.log("sending data file" + dataFile);
    }
    else {
        console.log("sending default file" + defaultFile);
        dataFile = defaultFile;
    }
    console.log("sending data file" + dataFile);
    // this should be async, but hey, not teaching you that part here yet
    var fileJs = fs.readFileSync(dataFile);
    // res.setHeader('content-type', 'text/javascript');
    res.write(fileJs);
    res.end();
    next();
});

app.use(function (req, res, next) {
  console.log(req.method + ': ' + req.url);
  next();
});

//server static files
//app.use(serveStatic(__dirname + "/public"));
app.use(serveStatic(__dirname + "/public", {'index': ['mainframe.html']}));


//start http server
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

// helper functions
function getRandomInt() {
  return Math.floor(Math.random() * 100000000);
}
