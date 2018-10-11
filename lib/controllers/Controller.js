const swaggerUi = require('swagger-ui-express');

const LocalDataHelper = require('../helper/LocalDataHelper');
const swaggerDocument = require('../swagger.json');

function getLocationTagFromParam(locationParam) {
  switch (locationParam) {
    case 'uni':
      return LocalDataHelper.LOCATION_UNI;

    case 'oth':
      return LocalDataHelper.LOCATION_OTH;

    case 'oth-abend':
      return LocalDataHelper.LOCATION_OTH_ABEND;

    case 'pruefening':
      return LocalDataHelper.LOCATION_PRUEFENING;

    default:
      return undefined;
  }
}

function getDayValFromParam(dayParam) {
  return dayParam === 'today' ? new Date().toLocaleString('en-US', { weekday: 'long' }).toLocaleLowerCase() : dayParam;
}

function getIngredients(request, response) {
  const data = LocalDataHelper.getIngredients();
  response.status(200).json(data);
}

function getIngredientsForKey(request, response) {
  const [key] = [request.params.key];

  const data = LocalDataHelper.getIngredients().find(ingredient => ingredient.key === key);
  response.status(200).json(data);
}

function getMenuForLocation(request, response) {
  const [location] = [request.params.location];
  const locationTag = getLocationTagFromParam(location);

  const data = LocalDataHelper.getCachedMenu(locationTag);
  response.status(200).json(data);
}

function getMenuForLocationOnDay(request, response) {
  const [location, day] = [request.params.location, request.params.day];
  const locationTag = getLocationTagFromParam(location);
  const dayVal = getDayValFromParam(day);

  const data = LocalDataHelper.getCachedMenu(locationTag).filter(item => item.day === dayVal);
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
