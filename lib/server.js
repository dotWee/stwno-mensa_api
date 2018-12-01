const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port);

const mensaProxy = require('./helper/Proxy');

// add restful controller
require('./controllers/RestfulExpress')(app);

// add graph controller
require('./controllers/GraphqlExpress')(app);

// define update job
function updateLocal() {
  console.log('Updating local cache...');
  mensaProxy.updateCache();
}
setInterval(updateLocal, 1000 * 60 * 60 * 24);

// and execute update on startup
updateLocal();

console.log(`Server started on port: ${port}`);
console.log(`Try http://localhost:${port}/mensa/uni/today`);
