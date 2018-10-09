const swaggerUi = require('swagger-ui-express');

const LocalDataHelper = require('../helper/LocalDataHelper');
const swaggerDocument = require('../swagger.json');

const REGEX_LOCATIONS = 'uni|oth|oth-evening|pruefening';
const REGEX_DAYS = 'monday|tuesday|wednesday|thursday|friday|saturday|sunday|today';

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

function menu(req, res) {
  console.log('GET', req.params);
  let fetchedMenu = [];

  // Return location specific menu if location is provided
  if (req.params.location) {
    try {
      fetchedMenu = fetchMenu(req.params.location, req.params.day);
    } catch (err) {
      console.error(err);
    }
  } else {
    // If not return menu combined for all locations (this will be a long)
    REGEX_LOCATIONS.split('|').forEach((location) => {
      try {
        if (!fetchedMenu) {
          fetchedMenu = [];
        }

        fetchedMenu.push(fetchMenu(location));
      } catch (err) {
        console.error(err);
      }
    });
  }

  res.status(200).json(fetchedMenu);
}

function toRepo(req, res) {
  res.redirect(301, 'https://github.com/dotWee/uni-oth_mensa_api');
}

function addRoutes(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
  }));

  app.route('/')
    .get(toRepo);

  app.route('/mensa')
    .get(menu);

  app.route(`/mensa/:location(${REGEX_LOCATIONS})`)
    .get(menu);

  app.route(`/mensa/:location(${REGEX_LOCATIONS})/:day(${REGEX_DAYS})`)
    .get(menu);
}

module.exports = addRoutes;
