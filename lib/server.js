var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// add controller
require('./controllers/Controller')(app);
app.listen(port);

var localDataHelper = require('./helper/LocalDataHelper');

// define job
setInterval(updateLocal, 1000*60*60*24);

// and run on startup
updateLocal();

console.log('Uni-oth_mensa_api started on port: ' + port);
console.log('Try http://localhost:' + port + '/mensa/uni/mo');

function updateLocal() {
    console.log('Updating local cache');
    localDataHelper.performUpdateAll();
}