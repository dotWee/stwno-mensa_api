const cache = require('./Cache');

const LOCATIONS_ALIASES = {
  'uni': ['university', 'universität'],
  'oth': ['othr', 'oth-regensburg'],
  'oth-abend': ['oth-evening'],
  'pruefening': ['oth-pruefening', 'oth-prüfening', 'prüfening'],
}
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
