var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// add uni routes
require('./api/routes/UniRoutes')(app);
app.listen(port);

console.log('Uni-oth_mensa_api started on port: ' + port);
console.log('Try http://localhost:' + port + '/mensa/uni/mo');