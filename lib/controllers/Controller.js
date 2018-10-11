const swaggerUi = require('swagger-ui-express');

const LocalDataHelper = require('../helper/LocalDataHelper');
const swaggerDocument = require('../swagger.json');

function fetchMenu(locationParam, dayParam) {
  let locationTag;

  switch (locationParam) {
    case 'uni':
      locationTag = LocalDataHelper.LOCATION_UNI;
      break;
    case 'oth':
      locationTag = LocalDataHelper.LOCATION_OTH;
      break;

    case 'oth-abend':
      locationTag = LocalDataHelper.LOCATION_OTH_ABEND;
      break;

    case 'pruefening':
      locationTag = LocalDataHelper.LOCATION_PRUEFENING;
      break;

    default:
      throw new Error(`Invalid location param: ${locationParam}`);
  }

  const fetchedMenu = LocalDataHelper.getCachedMenu(locationTag);
  if (dayParam === 'today') {
    dayParam = new Date().toLocaleString('en-US', { weekday: 'long' }).toLocaleLowerCase();
  }

  // console.log(`fetchMenu: dayParam=${dayParam} locationParam=${locationParam}`);
  return (dayParam ? fetchedMenu.filter(item => item.day === dayParam) : fetchedMenu);
}

function ingredients(req, res) {
  console.log('GET', req.params);

  const ingredientsArray = LocalDataHelper.getIngredients();
  if (req.params.key) {
    const ingredientKey = req.params.key;

    try {
      const specificIngredient = ingredientsArray.filter(ingredient => ingredientKey === ingredient.key)[0];
      if (specificIngredient) {
        res.status(200).json(specificIngredient);
      } else {
        throw new Error(`Invalid key param: ${ingredientKey}`);
      }
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  }

  res.status(200).json(ingredientsArray);
}

function menu(req, res) {
  console.log('GET', req.params);

  try {
    const fetchedMenu = fetchMenu(req.params.location, req.params.day);
    res.status(200).json(fetchedMenu);
  } catch (err) {
    res.status(200).json({
      message: 'No data available, mensa may be closed.',
    });
  }
}

function toDocs(req, res) {
  res.redirect(301, '/api-docs');
}

function addRoutes(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
  }));

  app.route('/')
    .get(toDocs);

  app.route('/ingredients')
    .get(ingredients);

  app.route('/ingredients/:key')
    .get(ingredients);

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)')
    .get(menu);

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)/:day(monday|tuesday|wednesday|thursday|friday|saturday|sunday|today)')
    .get(menu);
}

module.exports = addRoutes;
