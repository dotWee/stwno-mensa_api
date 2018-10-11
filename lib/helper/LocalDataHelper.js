const fs = require('fs');
const ingredients = require('./Ingredients.json');

const ResourceHelper = require('./ResourceHelper');

module.exports.LOCATION_UNI = 'UNI-R';
module.exports.LOCATION_OTH = 'HS-R-tag';
module.exports.LOCATION_OTH_ABEND = 'HS-R-abend';
module.exports.LOCATION_PRUEFENING = 'Cafeteria-Pruefening';

module.exports.LOCATION_TAGS = [this.LOCATION_UNI, this.LOCATION_OTH, this.LOCATION_OTH_ABEND, this.LOCATION_PRUEFENING];

function getFilename(locationTag) {
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  return `${dataDir}/${locationTag}.json`;
}

module.exports.getCachedMenu = function (locationTag) {
  try {
    const content = fs.readFileSync(getFilename(locationTag));
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

function promiseUpateLocation(locationTag) {
  return new Promise((resolve, reject) => {
    const filename = getFilename(locationTag);
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    ResourceHelper.fetchMenuAsync(locationTag, ResourceHelper.getCurrentWeek()).then((response) => {
      ResourceHelper.parseMenu(response).then((menu) => {
        fs.writeFileSync(filename, JSON.stringify(menu));
        resolve();
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports.performUpdateAll = function () {
  this.LOCATION_TAGS.forEach((locationTag) => {
    promiseUpateLocation(locationTag).then(() => {
      console.log(`fetched ${locationTag}`);
    }).catch((err) => {
      console.log(`error with ${locationTag}`, err);
    });
  });
};

function getIngredients() {
  return ingredients;
}
exports.getIngredients = getIngredients;