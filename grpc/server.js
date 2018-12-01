var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

const ingredients = require("./data/Ingredients.json")

var schema = buildSchema(`
  type Query {
    getIngredients: [Ingredient]
  }

  type Ingredient {
    key: String
    value: String
  }
`);

var root = {
  getIngredients: () => {
    return ingredients;
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');