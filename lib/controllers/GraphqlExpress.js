const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const cache = require('../helper/Cache');

exports.schema = buildSchema(`
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

exports.root = {
  getIngredients: () => cache.ingredients,
  getIngredient: ({ key }) => cache.ingredients.find(ingredient => ingredient.key === key),
  getMenuForLocation: ({ location }) => cache.readMenu(location),
  getMenuForLocationOnDay: ({ location, day }) => cache.readMenu(location).filter(item => item.day === cache.getDayValFromParam(day))
};

function useGraphql(app) {
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
      }));
};
module.exports = useGraphql;
