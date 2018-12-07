const cache = require('./Cache');

const LOCATIONS_ALIASES = {
  'uni': ['university', 'universität'],
  'oth': ['othr', 'oth-regensburg'],
  'oth-abend': ['oth-evening'],
  'pruefening': ['oth-pruefening', 'oth-prüfening', 'prüfening'],
};
const LOCATIONS = Object.keys(LOCATIONS_ALIASES);

function resolveLocation(locationValue) {
  let resolvedLocation;

  LOCATIONS.forEach((locationKey) => {
    if (locationKey === locationValue
      || LOCATIONS_ALIASES[locationKey].indexOf(locationValue) > -1) {
      resolvedLocation = locationKey;
    }
  });

  return resolvedLocation;
}
function isValidLocation(locationValue) {
  return resolveLocation(locationValue) !== undefined;
}
module.exports.isValidLocation = isValidLocation;

const DAYS_ALIASES = {
  'mo': ['mo', 'montag', 'monday'],
  'di': ['di', 'dienstag', 'tuesday'],
  'mi': ['mi', 'mittwoch', 'wednesday'],
  'do': ['do', 'donnerstag', 'thursday'],
  'fr': ['fr', 'freitag', 'friday'],
  'sa': ['sa', 'samstag', 'saturday'],
  'so': ['so', 'sonntag', 'sunday']
};
const DAYS = Object.keys(DAYS_ALIASES);

function resolveDay(dayValue) {
  let resolvedDay;

  DAYS.forEach((dayKey) => {
    if (dayKey === dayValue
      || DAYS_ALIASES[dayKey].indexOf(dayValue) > -1) {
      resolvedDay = dayKey;
    }
  });

  return resolvedDay;
}

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

/**
 * Returns a specific ingredient with provided key.
 * @param {*} key
 */
function getIngredient(key) {
  if (!key) {
    throw new Error('Key value is undefined.');
  }

  return getIngredients.find(ingredient => ingredient.key === key);
}

/**
 * Returns all items.
 */
function getItems() {
  const items = [];
  LOCATIONS.forEach(locationKey => items.push(getItems(locationKey)));

  return items;
}

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

/**
 * Returns all items for the provided location on given day.
 * @param {*} location
 * @param {*} day
 */
function getItemsOnLocationForDay(location, day) {
  if (!day) {
    throw new Error('Day is undefined.');
  }

  const resolvedDay = resolveDay(day);
  if (!resolvedDay) {
    throw new Error(`Day ${day} is invalid.`);
  }

  return getItems(location).filter(item => item.day === day);
}

/**
 * Returns all items for the provided location on given date.
 * @param {*} location
 * @param {*} date
 */
function getItemsOnLocationForDate(location, date) {
  if (!date) {
    throw new Error('Date is undefined.');
  }

  return getItems(location).filter(item => item.date === date);
}
