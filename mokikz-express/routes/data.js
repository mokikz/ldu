
/* GET users listing. */
const dataJs = function (req, res, next) {
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
};

module.exports = dataJs;
