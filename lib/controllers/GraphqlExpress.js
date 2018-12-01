const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const cache = require('../helper/Cache');
const proxy = require('../helper/Proxy');

const graphqlSchema = buildSchema(`
type Query {
  ingredients(key: String): [Ingredient]
  menu(location: String, day: String): Menu
}

type Menu {
  args: Arguments
  count: Int
  items: [Item]
}

type Arguments {
  location: String
  day: String
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

const queries = {
  ingredients: ({ key }) => {
    const data = cache.ingredients;
    return key ? [data.find(ingredient => ingredient.key === key)] : data;
  },
  menu: ({ location, day }) => {
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

    if (day) {
      args.day = day;
      data = data.filter(item => item.day === cache.getDayValFromParam(day));
    }

    return {
      args: args,
      count: data.length,
      items: data,
    };
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
