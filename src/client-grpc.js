const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

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

function main() {
  const clientIngredients = new protoSchema.Ingredients('localhost:50051', grpc.credentials.createInsecure());
  clientIngredients.getIngredients({
    key: '1',
  }, (err, response) => {
    console.log('Response:', response);
    if (err) {
      console.error(err);
    }
  });

  const clientMenus = new protoSchema.Menus('localhost:50051', grpc.credentials.createInsecure());
  clientMenus.getMenus({
  }, (err, response) => {
    console.log('Response:', response);
    if (err) {
      console.error(err);
    }
  });
}

main();
