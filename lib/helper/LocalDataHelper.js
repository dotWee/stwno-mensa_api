'use strict';

var resourcehelper = require('./ResourceHelper');
var fs = require('fs');

module.exports.LOCATION_UNI = 'UNI-R';
module.exports.LOCATION_OTH = 'HS-R-tag';
module.exports.LOCATION_OTH_ABEND = 'HS-R-abend';
module.exports.LOCATION_PRUEFENING = 'Cafeteria-Pruefening';

module.exports.LOCATION_TAGS = [this.LOCATION_UNI, this.LOCATION_OTH, this.LOCATION_OTH_ABEND, this.LOCATION_PRUEFENING];

module.exports.getCachedMenu = function (locationTag) {
    return JSON.parse(fs.readFileSync(getFilename(locationTag)));
};

function getFilename(locationTag) {
    let dataDir = './data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    return dataDir + '/' + locationTag + '.json';
}

module.exports.performUpdateAll = function () {
    this.LOCATION_TAGS.forEach((locationTag) => {
        promiseUpateLocation(locationTag).then(() => {
            console.log('fetched ' + locationTag);
        }).catch((err) => {
            console.log('error with ' + locationTag, err);
        });
    });
};

function promiseUpateLocation(locationTag) {
    return new Promise((resolve, reject) => {
        let filename = getFilename(locationTag);
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }

        resourcehelper.fetchMenuAsync(locationTag, resourcehelper.getCurrentWeek()).then((response) => {
            resourcehelper.parseMenu(response).then((menu) => {
                fs.writeFileSync(filename, JSON.stringify(menu));
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};