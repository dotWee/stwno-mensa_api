const cache = require('./Cache');

const LOCATIONS_ALIASES = {
  'uni': ['university', 'universität'],
  'oth': ['othr', 'oth-regensburg'],
  'oth-abend': ['oth-evening'],
  'pruefening': ['oth-pruefening', 'oth-prüfening', 'prüfening'],
};
const LOCATIONS = Object.keys(LOCATIONS_ALIASES);

function isValidLocation(locationValue) {
  let found = false;

  LOCATIONS.forEach(locationKey => {
    if (locationKey === locationValue || LOCATIONS_ALIASES[locationKey].indexOf(locationValue) > -1) {
      //console.log('found');
      found = true;
    }
  });

  return found;
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

function isValidDay(dayValue) {
  let found = false;

  DAYS.forEach(dayKey => {
    if (dayKey === dayValue || DAYS_ALIASES[dayKey].indexOf(dayValue) > -1) {
      found = true;
    }
  });

  return found;
}
module.exports.isValidDay = isValidDay;
