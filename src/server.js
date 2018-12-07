const express = require('express');
const grpc = require('grpc');

const mensaProxy = require('./helper/Proxy');
const grpcController = require('./controllers/GrpcController');

const app = express();
const port = process.env.PORT || 3000;
const portGrpc = port + 1;
app.listen(port);

// add restful controller
require('./controllers/RestfulExpress')(app);

// add graph controller
require('./controllers/GraphqlExpress')(app);

// add grpc services
const server = new grpc.Server();
grpcController.addServices(server);
server.bind(`0.0.0.0:${portGrpc}`, grpc.ServerCredentials.createInsecure());
server.start();

// define update job
function updateLocal() {
  console.log('Updating local cache...');
  mensaProxy.updateCache();
}
setInterval(updateLocal, 1000 * 60 * 60 * 24);

// update local cache on startup
updateLocal();

console.log(`Webserver started on port: ${port}`);
console.log(`GRPC listening on port: ${portGrpc}\n`);

console.log(`See http://localhost:${port}/api-docs for RESTful API docs`);
console.log(`Or http://localhost:${port}/graphql about GraphQL usage\n`);