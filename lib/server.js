const express = require('express');
const mensaProxy = require('./helper/Proxy');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port);

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

// update local cache on startup
updateLocal();

console.log(`Server started on port: ${port}\n`);

console.log(`See http://localhost:${port}/api-docs for RESTful API docs`);
console.log(`Or http://localhost:${port}/graphql about GraphQL usage\n`);
