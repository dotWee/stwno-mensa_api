# rgb-mensa_api

[![npm @latest](https://img.shields.io/npm/v/rgb-mensa_api.svg)](https://www.npmjs.com/package/rgb-mensa_api)
[![dependencies Status](https://david-dm.org/dotWee/rgb-mensa_api/status.svg)](https://david-dm.org/dotWee/rgb-mensa_api)
[![devDependencies Status](https://david-dm.org/dotWee/rgb-mensa_api/dev-status.svg)](https://david-dm.org/dotWee/rgb-mensa_api?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/dotWee/rgb-mensa_api.svg)](https://github.com/dotWee/rgb-mensa_api/issues)
[![GitHub license](https://img.shields.io/github/license/dotWee/rgb-mensa_api.svg)](https://github.com/dotWee/rgb-mensa_api)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FdotWee%2Frgb-mensa_api.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FdotWee%2Frgb-mensa_api?ref=badge_large)

This node application is a json-wrapper around the inofficial API for different canteens of the university (and university of applied sciences) in Regensburg, germany.  

The original API is kind of unhandy, as it serves its weekly data in the **csv** format. To improve the handling for more simple applications, this wrapper allows more routes and serves its data in the **json** format.

The following canteens are supported:

- OTH
- OTH evening / abends
- University (Sammelgebäude)
- Prüfening

## Table of contents

1. [Build](###Build)
2. [Run](###Run)
3. [Usage](###Usage)  
    3.1. [RESTful API](####RESTful-API)  
    3.2. [GraphQL](####GraphQL)  
    3.3. [gRPC](####gRPC)
4. [Development](###Development)
5. [Acknowledges](###Acknowledges)
6. [License](###License)

### Build

Clone repository:

`$ git clone https://github.com/dotWee/rgb-mensa_api && cd rgb-mensa_api`

Install dependencies:

`$ npm install`

### Run

Start the application by executing `$ npm run start`:

```bash
$ npm run start

> rgb-mensa_api@2.1.0 start /Users/lukas/Git/Projects/Javascript/rgb-mensa_api
> node lib/server.js

Updating local cache...
Server started on port: 3000

See http://localhost:3000/api-docs for RESTful API docs
Or http://localhost:3000/graphql about GraphQL usage
```

### Usage

This Node.js application is deployed to herokuapp:
- https://rgb-mensa-api.herokuapp.com/api-docs

#### RESTful-API

Checkout the [API documentation](https://rgb-mensa-api.herokuapp.com/api-docs) for informations on how to use the RESTful API.

For example, get todays menu for the university canteen:

    GET /mensa/uni/today

```json
[
    {
    "name": "Karotten-Ingwer-Suppe",
    "date": "26.11.2018",
    "day": "monday",
    "category": "Suppe",
    "labels": [
      "V"
    ],
    "ingredients": [
      {
        "key": "3",
        "value": "mit Antioxidationsmittel"
      },
      {
        "key": "A",
        "value": "Gluten"
      },
      {
        "key": "AA",
        "value": "Weizen"
      },
      {
        "key": "I",
        "value": "Sellerie"
      }
    ],
    "price": {
      "students": "0,70",
      "employees": "0,90",
      "guests": "1,40"
    }
  }, ...
]
```

#### GraphQL

Beside the usual RESTful API, this application also provides a [GraphQL](https://graphql.github.io/) service. From GraphQL's website:

> GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data.

You can play with its service by visiting [rgb-mensa-api.herokuapp.com/graphql](https://rgb-mensa-api.herokuapp.com/graphql) (or [localhost:3000/graphql](http://localhost:3000/graphql) in case of local execution).

##### Example GraphQL query

```graphql
{
  ingredients(key: "5") {
    value
  }
  menu(location: "uni", day: "monday") {
    args {
      location
      day
    }
    count
    items {
      name
      date
      day
      category
      labels
      ingredients {
        key
        value
      }
      price {
        students
        guests
        employees
      }
    }
  }
}
```

##### Example response

```json
{
    "data": {
        "ingredients": [{
            "value": "geschwefelt"
        }],
        "menu": {
            "args": {
                "location": "uni",
                "day": "monday"
            },
            "count": 1,
            "items": [{
                "name": "Karotten-Ingwer-Suppe",
                "date": "26.11.2018",
                "day": "monday",
                "category": "Suppe",
                "labels": [
                    "V"
                ],
                "ingredients": [{
                        "key": "3",
                        "value": "mit Antioxidationsmittel"
                    },
                    {
                        "key": "A",
                        "value": "Gluten"
                    },
                    {
                        "key": "AA",
                        "value": "Weizen"
                    },
                    {
                        "key": "I",
                        "value": "Sellerie"
                    }
                ],
                "price": {
                    "students": "0,70",
                    "guests": "1,40",
                    "employees": "0,90"
                }
            }]
        }
    }
}
```

#### gRPC

This application also supports access using the [gRPC Framework](https://grpc.io/about/) with Google's Protocol Buffers as JSON alternative.

This is what the protocol configuration looks like (_File [src/mensa.proto](src/protos/mensa.proto)_):

```protobuf
syntax = "proto3";

package rgbmensaapi;

// The ingredients service definition.
service Ingredients {
  // Returns ingredients
  rpc GetIngredients (IngredientsRequest) returns (IngredientsResponse) {}
}

// The ingredients request, may containing a key
message IngredientsRequest {
    string key = 1;
}

// The ingredients response
message IngredientsResponse {
  message Arguments {
    string key = 1;
  }
  Arguments args = 1;
  repeated Ingredient ingredients = 2;
}

// The ingredients object
message Ingredient {
  string key = 1;
  string value = 2;
}

// The menu service definition.
service Menus {
  // Returns menu
  rpc GetMenus (MenuRequest) returns (MenuResponse) {}
}

// The menu request, may containing arguments
message MenuRequest {
  string location = 1;
  string day = 2;
}

// The menu response
message MenuResponse {
  Menu menu = 2;
}

message Menu {
  message Arguments {
    string location = 1;
    string day = 2;
  }
  Arguments args = 1;

  required int64 count = 2;

  message Item {
    string name = 1;
    string date = 2;
    string day = 3;
    string category = 4;
    repeated string labels = 5;
    repeated Ingredient ingredients = 6;

    message Price {
      string students = 1;
      string employees = 2;
      string guests = 3; 
    }
    Price price = 7;
  }
  repeated Item items = 3;
}
```

##### Example client (using Node.js): 

```js
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
  clientMenus.getMenus({}, (err, response) => {
    console.log('Response:', response);
    if (err) {
      console.error(err);
    }
  });
}

main();
```

### Development

For local development, use `$ npm run nodemon` to work at the source code. The application will reload on code changes.

### Acknowledges

This application is heavily inspired by @alexanderbazo's [URMensa-JSON-API](https://github.com/alexanderbazo/URMensa-JSON-API) project.

### License

Copyright (c) 2018 Lukas Wolfsteiner. This project is licensed under the [_Do What The Fuck You Want To_](/LICENSE) public license:

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                        Version 2, December 2004 

    Copyright (C) 2018 Lukas Wolfsteiner <lukas@wolfsteiner.media>

    Everyone is permitted to copy and distribute verbatim or modified 
    copies of this license document, and changing it is allowed as long 
    as the name is changed. 

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

    0. You just DO WHAT THE FUCK YOU WANT TO.
