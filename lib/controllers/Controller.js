const LocalDataHelper = require('../helper/LocalDataHelper');

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
  return (dayParam ? fetchedMenu.filter(item => item.day === dayParam) : fetchedMenu);
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

module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.redirect(301, 'https://github.com/dotWee/uni-oth_mensa_api');
  });

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)')
    .get(menu);

  app.route('/mensa/:location(uni|oth|oth-evening|pruefening)/:day(monday|tuesday|wednesday|thursday|friday|saturday|sunday)')
    .get(menu);
};
