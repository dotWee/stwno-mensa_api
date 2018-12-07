const fs = require('fs');

const INGREDIENTS = require('../consts/Ingredients.json');
const LOCATIONS = require('../consts/Locations.json');
const DAYS = require('../consts/Days.json');

module.exports.INGREDIENTS = INGREDIENTS;
module.exports.LOCATIONS = LOCATIONS;
module.exports.DAYS = DAYS;

function getFilename(location) {
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  return `${dataDir}/${location}.json`;
}

function writeMenu(location, menu) {
  const filename = getFilename(location);
  console.log(`writeMenu: location=${location} filename=${filename}`);

  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }

  fs.writeFileSync(filename, JSON.stringify(menu));
}
module.exports.writeMenu = writeMenu;

function readMenu(location) {
  const filename = getFilename(location);
  console.log(`readMenu: location=${location} filename=${filename}`);

  if (fs.existsSync(filename)) {
    try {
      const data = fs.readFileSync(filename);
      return JSON.parse(data);
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error(`No cached menu for location=${location} filename=${filename}`);
  }
}
module.exports.readMenu = readMenu;

function getIngredients() {
  return INGREDIENTS;
}
exports.getIngredients = getIngredients;
