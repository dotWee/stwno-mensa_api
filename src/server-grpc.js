/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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

const rgbmensaapi_proto = grpc.loadPackageDefinition(packageDefinition).rgbmensaapi;

/**
 * Implements the GetIngredients RPC method.
 */
function getIngredients(call, callback) {
  let data = cache.ingredients;
  let key = call.request.key;

  if (key) {
    data = [data.find(ingredient => ingredient.key === key)];
  }

  callback(null, {
    ingredients: data,
  });
}

/**
 * Implements the GetMenu RPC method.
 */
function getMenus(call, callback) {
  const location = call.request.location;

  let data = [];
  const args = {};

  if (location) {
    args.location = location;
    data = cache.readMenu(location);
  } else {
    proxy.locations.forEach((locationValue) => {
      data = data.concat(cache.readMenu(locationValue));
    });
  }

  const day = call.request.day;
  if (day) {
    args.day = day;
    data = data.filter(item => item.day === cache.getDayValFromParam(day));
  }

  callback(null, {
    menu: {
      args: args,
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
  /*
  server.addService(rgbmensaapi_proto.Ingredients.service, {
    getIngredients: getIngredients,
  });
  */
  server.addService(rgbmensaapi_proto.Menus.service, {
    getMenus: getMenus,
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
