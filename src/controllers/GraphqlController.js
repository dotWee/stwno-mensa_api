const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const Provider = require('../helper/Provider');
const InvalidLocationParameterError = require('../errors/InvalidLocationParameterError');
const InvalidDayParameterError = require('../errors/InvalidDayParameterError');

const graphqlSchema = buildSchema(`
type Query {
  ingredients(key: String): [Ingredient]
  mensa(location: String, day: String): [Item]
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

type Error {
  name: String!
  message: String!
}
`);

const queries = {
  ingredients: ({
    key,
  }) => {
    if (key) {
      return Provider.getIngredient(key);
    }

    return Provider.getIngredients();
  },
  mensa: ({
    location,
    day,
  }) => {
    if (location) {
      if (!Provider.isValidLocation(location)) {
        return new InvalidLocationParameterError(location);
      }

      if (day) {
        if (!Provider.isValidDay(day)) {
          return new InvalidDayParameterError(day);
        }

        return Provider.getItemsOnLocationForDay(location, day);
      }

      return Provider.getItemsOnLocation(location);
    }

    return Provider.getItems();
  },
};

function useGraphql(app) {
  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: queries,
    graphiql: true,
  }));
}
module.exports = useGraphql;
