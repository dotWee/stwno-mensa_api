const cache = require('./Cache');

function resolveLocation(locationValue) {
  let resolvedLocation;

  Object.keys(cache.LOCATIONS).forEach((locationKey) => {
    if (locationKey === locationValue ||
      cache.LOCATIONS[locationKey].indexOf(locationValue) > -1) {
      resolvedLocation = locationKey;
    }
  });

  return resolvedLocation;
}
module.exports.resolveLocation = resolveLocation;

function isValidLocation(locationValue) {
  return resolveLocation(locationValue) !== undefined;
}
module.exports.isValidLocation = isValidLocation;

function resolveDay(dayValue) {
  let resolvedDay;

  Object.keys(cache.DAYS).forEach((dayKey) => {
    if (dayKey === dayValue
      || cache.DAYS[dayKey].indexOf(dayValue) > -1) {
      resolvedDay = dayKey;
    }
  });

  return resolvedDay;
}
module.exports.resolveDay = resolveDay;

function resolveToday() {
  const todayValue = new Date().toLocaleString('en-US', {
    weekday: 'long',
  }).toLocaleLowerCase();

  return resolveDay(todayValue);
}
module.exports.resolveToday = resolveToday;

function isValidDay(dayValue) {
  return resolveDay(dayValue) !== undefined;
}
module.exports.isValidDay = isValidDay;

/**
 * Returns all possible ingredients.
 */
function getIngredients() {
  return cache.getIngredients();
}
module.exports.getIngredients = getIngredients;

/**
 * Looks for ingredients containing the provided value.
 * @param {*} value
 */
function filterIngredients(value) {
  if (!value) {
    throw new Error('Filter value is undefined.');
  }

  return getIngredients.filter(ingredient => ingredient.value.includes(value));
}
module.exports.filterIngredients = filterIngredients;

/**
 * Returns a specific ingredient with provided key.
 * @param {*} key
 */
function getIngredientsForKey(key) {
  if (!key) {
    throw new Error('Key value is undefined.');
  }

  return getIngredients().filter(ingredient => ingredient.key === key);
}
module.exports.getIngredientsForKey = getIngredientsForKey;

/**
 * Returns all items.
 */
function getItems() {
  const items = [];
  Object.keys(cache.LOCATIONS).forEach(locationKey => items.push(cache.readMenu(locationKey)));

  return items;
}
module.exports.getItems = getItems;

/**
 * Returns all items for the provided location.
 * @param {*} location
 */
function getItemsOnLocation(location) {
  if (!location) {
    throw new Error('Location is undefined');
  }

  const resolvedLocation = resolveLocation(location);
  if (!resolvedLocation) {
    throw new Error(`Location ${location} is invalid.`);
  }

  return cache.readMenu(resolvedLocation);
}
module.exports.getItemsOnLocation = getItemsOnLocation;

/**
 * Returns all items for the provided location on given day.
 * @param {*} location
 * @param {*} day
 */
function getItemsOnLocationForDay(location, day) {
  if (!day) {
    throw new Error('Day is undefined.');
  }

  const resolvedDay = (day === 'today' || day === 'heute')
    ? resolveToday() : resolveDay(day);

  if (!resolvedDay) {
    throw new Error(`Day ${day} is invalid.`);
  }

  //console.log(`getItemsOnLocationForDay: location=${location} day=${day} resolvedDay=${resolvedDay}`);
  return getItemsOnLocation(location).filter(item => item.day === resolvedDay);
}
module.exports.getItemsOnLocationForDay = getItemsOnLocationForDay;
