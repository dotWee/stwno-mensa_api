const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const cache = require('./helper/Cache');
const proxy = require('./helper/Proxy');

const PROTO_PATH = __dirname + '/protos/mensa.proto';
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const protoSchema = grpc.loadPackageDefinition(packageDefinition).rgbmensaapi;

/**
 * Implements the GetIngredients RPC method.
 */
function getIngredients(call, callback) {
  let data = cache.ingredients;
  const args = {
    key: call.request.key,
  };

  if (args.key) {
    data = [data.find(ingredient => ingredient.key === args.key)];
  }

  callback(null, {
    args,
    ingredients: data,
  });
}

/**
 * Implements the GetMenu RPC method.
 */
function getMenus(call, callback) {
  const args = {
    location: call.request.location,
    day: call.request.day,
  };

  let data = [];
  if (args.location) {
    data = cache.readMenu(args.location);
  } else {
    proxy.locations.forEach((locationValue) => {
      data = data.concat(cache.readMenu(locationValue));
    });
  }

  if (args.day) {
    data = data.filter(item => item.day === cache.getDayValFromParam(args.day));
  }

  callback(null, {
    menu: {
      args,
      count: data.length,
      items: data,
    },
  });
}

/**
 * Starts an RPC server that receives requests for the Ingredients service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server();

  server.addService(protoSchema.Ingredients.service, {
    getIngredients,
  });

  server.addService(protoSchema.Menus.service, {
    getMenus,
  });

  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
