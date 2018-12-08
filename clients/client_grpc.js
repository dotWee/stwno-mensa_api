const grpc = require('grpc');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const host = 'localhost:3001';
const protoPath = `${__dirname}/../src/protos/schema.proto`;
const protoSchema = grpc.loadPackageDefinition(protoLoader.loadSync(
  protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
)).rgbmensaapi;

/**
 * Resolve ingredient with key 1.
 */
function getIngredients() {
  const client = new protoSchema.Ingredients(host, grpc.credentials.createInsecure());
  const options = {
    key: '1',
  };

  console.log('Requesting ingredients with options', options);
  client.getIngredients(options, (err, res) => {
    console.log('Response:', res);

    if (err) {
      console.error('Error', err);
    }
  });
}
getIngredients();

/**
 * Get todays menu at university canteen.
 */
function getItems() {
  const client = new protoSchema.Items(host, grpc.credentials.createInsecure());
  const options = {
    location: 'regensburg-university',
    day: 'monday',
  };

  console.log('Requesting menu with options', options);
  client.getItems(options, (err, res) => {
    console.log('Response:', res);

    if (err) {
      console.error('Error', err);
    }
  });
}
getItems();
