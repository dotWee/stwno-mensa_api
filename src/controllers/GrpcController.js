const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const Provider = require('../helper/Provider');

const PROTO_PATH = `${__dirname  }/../protos/grpc-schema.proto`;
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
module.exports.protoSchema = protoSchema;
/**
 * Implements the GetIngredients RPC method.
 */
function getIngredients(call, callback) {
  try {
    const data = (call.request.key)
      ? Provider.getIngredientsForKey(call.request.key) : Provider.getIngredients();
    callback(null, data);
  } catch (err) {
    callback(err);
  }
}
module.exports.getIngredients = getIngredients;

/**
 * Implements the GetMenu RPC method.
 */
function getItems(call, callback) {
  try {
    let data;
    const [location, day] = [call.request.location, call.request.day];

    if (location) {
      if (day) {
        data = Provider.getItemsOnLocationForDay(call.request.location, call.request.day);
      } else {
        data = Provider.getItemsOnLocation(call.request.location);
      }
    } else {
      data = Provider.getItems();
    }

    callback(null, data);
  } catch (err) {
    callback(err);
  }
}
module.exports.getItems = getItems;

function addServices(server) {
  server.addService(protoSchema.Ingredients.service, {
    getIngredients,
  });

  server.addService(protoSchema.Items.service, {
    getItems,
  });
}
module.exports.addServices = addServices;
