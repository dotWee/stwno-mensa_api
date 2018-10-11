const swaggerUi = require('swagger-ui-express');

const cache = require('../helper/Cache');
const swaggerDocument = require('../swagger.json');

function getDayValFromParam(dayParam) {
  return dayParam === 'today' ? new Date().toLocaleString('en-US', { weekday: 'long' }).toLocaleLowerCase() : dayParam;
}

function getIngredients(request, response) {
  const data = cache.getIngredients();
  response.status(200).json(data);
}

function getIngredientsForKey(request, response) {
  const data = cache.getIngredients()
    .find(ingredient => ingredient.key === request.params.key);

  response.status(200).json(data);
}

function getMenuForLocation(request, response) {
  const data = cache.readMenu(request.params.location);
  response.status(200).json(data);
}

function getMenuForLocationOnDay(request, response) {
  const dayVal = getDayValFromParam(request.params.day);

  const data = cache.readMenu(request.params.location)
    .filter(item => item.day === dayVal);
  response.status(200).json(data);
}

function toDocs(request, response) {
  response.redirect(301, '/api-docs');
}

function addRoutes(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
  }));

  app.route('/')
    .get(toDocs);

  app.route('/ingredients')
    .get(getIngredients);

  app.route('/ingredients/:key')
    .get(getIngredientsForKey);

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)')
    .get(getMenuForLocation);

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)/:day(monday|tuesday|wednesday|thursday|friday|saturday|sunday|today)')
    .get(getMenuForLocationOnDay);
}

module.exports = addRoutes;
