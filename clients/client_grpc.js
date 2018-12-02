const grpc = require('grpc');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '/../src/protos/mensa.proto');
const HOST = 'localhost:3001';

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

function getIngredients() {
  const ingredientsClient = new protoSchema.Ingredients(HOST, grpc.credentials.createInsecure());
  const ingredientsOpt = {
    key: '1',
  };

  console.log('Requesting ingredients with options', ingredientsOpt);
  ingredientsClient.getIngredients(ingredientsOpt, (err, response) => {
    console.log('Response:', response);
    if (err) {
      console.error('Error', err);
    }
  });
}
getIngredients();

function getMenu() {
  const menuClient = new protoSchema.Menus(HOST, grpc.credentials.createInsecure());
  const menuRequestOptions = {
    location: 'uni',
  };

  console.log('Requesting menu with options', menuRequestOptions);
  menuClient.getMenus(menuRequestOptions, (err, response) => {
    console.log('Response:', response);
    if (err) {
      console.error('Error', err);
    }
  });
}
getMenu();
