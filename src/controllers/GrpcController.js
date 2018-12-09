const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const Provider = require('../helper/Provider');

const InvalidLocationParameterError = require('../errors/InvalidLocationParameterError');
const InvalidDayParameterError = require('../errors/InvalidDayParameterError');

const PROTO_PATH = `${__dirname}/../protos/schema.proto`;
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const protoSchema = grpc.loadPackageDefinition(packageDefinition).stwno_mensa_api;
module.exports.protoSchema = protoSchema;

/**
 * Implements the GetLocations RPC method.
 */
function getLocations(call, callback) {
  try {
    const data = Provider.getLocations();
    callback(null, { locations: data });
  } catch (err) {
    callback({ error: err });
  }
}
module.exports.getLocations = getLocations;

/**
 * Implements the GetIngredients RPC method.
 */
function getIngredients(call, callback) {
  try {
    const data = (call.request.key)
      ? Provider.getIngredientsForKey(call.request.key) : Provider.getIngredients();
    callback(null, { ingredients: data });
  } catch (err) {
    callback({ error: err });
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
      if (!Provider.isValidLocation(location)) {
        throw new InvalidLocationParameterError(location);
      }

      if (day) {
        if (!Provider.isValidDay(day)) {
          throw new InvalidDayParameterError(day);
        }

        data = Provider.getItemsOnLocationForDay(call.request.location, call.request.day);
      } else {
        data = Provider.getItemsOnLocation(call.request.location);
      }
    } else {
      data = Provider.getItems();
    }

    callback(null, { items: data });
  } catch (err) {
    callback({ error: err });
  }
}
module.exports.getItems = getItems;

function addServices(server) {
  server.addService(protoSchema.Locations.service, {
    getLocations,
  });

  server.addService(protoSchema.Ingredients.service, {
    getIngredients,
  });

  server.addService(protoSchema.Items.service, {
    getItems,
  });
}
module.exports.addServices = addServices;
