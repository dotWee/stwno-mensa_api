const fs = require('fs');
const ingredients = require('./Ingredients.json');

exports.ingredients = ingredients;

function getFilename(location) {
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  return `${dataDir}/${location}.json`;
}

function writeMenu(location, menu) {
  const filename = getFilename(location);
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }

  fs.writeFileSync(filename, JSON.stringify(menu));
  //console.log('WRITE', filename);
}
module.exports.writeMenu = writeMenu;

function readMenu(location) {
  const filename = getFilename(location);

  if (fs.existsSync(filename)) {
    try {
      const data = fs.readFileSync(filename);
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      return [];
    }
  } else return [];
}
module.exports.readMenu = readMenu;

function getIngredients() {
  return ingredients;
}
exports.getIngredients = getIngredients;

function getDayValFromParam(dayParam) {
  return dayParam === 'today' ? new Date().toLocaleString('en-US', {
    weekday: 'long'
  }).toLocaleLowerCase() : dayParam;
}
exports.getDayValFromParam = getDayValFromParam;