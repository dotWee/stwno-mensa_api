'use strict';

module.exports.LOCATION_TAGS = ['UNI-R', 'Cafeteria-Pruefening', 'HS-R-abend', 'HS-R-tag'];

var http = require('http');
var fs = require('fs');

module.exports.getSourceUrl = function (locationTag, week) {
    return 'http://www.stwno.de/infomax/daten-extern/csv/' + locationTag + '/' + week + '.csv';
};

module.exports.getCurrentWeek = function () {
    return new Date().getWeek();
};

module.exports.performFetch = function() {
    let week = this.getWeek();

    this.LOCATION_TAGS.forEach(locationTag => {
        fs.exists(this.getOutputFileName(locationTag, week), function (exists) {
            if (!exists) {
                this.fetchMenu(locationTag, week);
            }
          });
    });
}

module.exports.getOutputFileName = function (locationTag, week) {
    let path = './data';

    try {
        fs.mkdirSync(path);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }

    path = path + '/' + locationTag;
    try {
        fs.mkdirSync(path);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }

    return path + '/' + week + '.csv';
}

module.exports.fetchMenu = function (locationTag, week) {
    let file = fs.createWriteStream(this.getOutputFileName(locationTag, week));
    let url = this.getSourceUrl(locationTag, week);

    http.get(url, function (response) {
        response.pipe(file);
    });
};

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = ((today - onejan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7)
};