const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const mensaProxy = require('./helper/Proxy');

// setup express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// tell express to use cors
app.use(cors());

// add routes to express
require('./controllers/Controller')(app);

// setup local port to listen on
const port = process.env.PORT || 3000;
app.listen(port);

// define update job
function updateLocal() {
  console.log('Updating local cache...');
  mensaProxy.updateCache();
}

// update menu cache on startup
updateLocal();

// and run cache refresh every day
setInterval(updateLocal, 1000 * 60 * 60 * 24);

console.log(`Server started on port: ${port}`);
console.log(`Try http://localhost:${port}/mensa/uni/today`);
