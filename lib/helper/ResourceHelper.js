'use strict';

const parse = require('csv-parse');
const conv = require("iconv-lite");


module.exports.getSourceUrl = function (locationTag, week) {
    return 'http://www.stwno.de/infomax/daten-extern/csv/' + locationTag + '/' + week + '.csv';
};

module.exports.getCurrentWeek = function () {
    return new Date().getWeek();
};

module.exports.fetchMenuAsync = async function (locationTag, week) {
    let url = this.getSourceUrl(locationTag, week);
    const response = await getContent(url);
    return response;
};

module.exports.parseMenu = function (response) {
    return new Promise((resolve, reject) => {
        parse(response, {
            delimiter: ';',
            columns: true
        }, function (err, out) {
            if (err) {
                reject(err);
            }

            let cleaned = [];
            out.forEach(item => {
                let details = [];
                let rawDetails = item.name.match(/(?=\().+?(?:\))/);
                if (rawDetails && rawDetails[0]) {
                    details = rawDetails[0].replace(/[{()}]/g, '').split(',');
                }

                cleaned.push({
                    name: item.name.replace(/(?=\().+?(?:\))/g, "").trim(),
                    date: item.datum,
                    day: item.tag.toLowerCase(),
                    category: item.warengruppe,
                    labels: item.kennz.split(','),
                    details: details,
                    price: {
                        students: item.stud,
                        employees: item.bed,
                        guests: item.gast
                    },

                    // For debugging
                    //origin: item
                });
            });

            resolve(cleaned);
        });
    });
};

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = ((today - onejan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
};

const getContent = function (url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, error: ' + response.statusCode + ' Url: ' + url));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(conv.decode(new Buffer(chunk), "ISO-8859-1")));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err));
    });
};