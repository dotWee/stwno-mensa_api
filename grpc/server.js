var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

const ingredients = require("./data/Ingredients.json")
const cache = require('./helper/Cache');
const mensaProxy = require('./helper/Proxy');

// define update job
function updateLocal() {
  console.log('Updating local cache...');
  mensaProxy.updateCache();
}
setInterval(updateLocal, 1000 * 60 * 60 * 24);

// and execute update on startup
updateLocal();

var schema = buildSchema(`
  type Query {
    getIngredients: [Ingredient]!
    getIngredient(key: String!): Ingredient

    getMenuForLocation(location: String!): [Item]
    getMenuForLocationOnDay(location: String!, day: String!): [Item]
  }

  type Ingredient {
    key: String!
    value: String!
  }

  type Price {
    students: String!
    employees: String!
    guests: String!
  }

  type Item {
    name: String!
    date: String!
    day: String!
    category: String!
    labels: [String]
    ingredients: [Ingredient]
    price: Price!
  }
`);

var root = {
  getIngredients: () => {
    return ingredients;
  },
  getIngredient: ({key}) => {
    return ingredients.find(ingredient => ingredient.key === key)
  },
  getMenuForLocation: ({location}) => {
    return cache.readMenu(location);
  },
  getMenuForLocationOnDay: ({location, day}) => {
    const dayVal = getDayValFromParam(day);

    return cache.readMenu(location).filter(item => item.day === dayVal);
  }
};

function getDayValFromParam(dayParam) {
  return dayParam === 'today' ? new Date().toLocaleString('en-US', { weekday: 'long' }).toLocaleLowerCase() : dayParam;
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');