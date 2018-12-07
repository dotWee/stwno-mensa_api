const parse = require('csv-parse');
const conv = require('iconv-lite');
const http = require('http');

const parser = require('./Parser');
const cache = require('./Cache');
const Provider = require('./Provider');

function downloadMenu(locationTag, week) {
  return new Promise((resolve, reject) => {
    const url = `http://www.stwno.de/infomax/daten-extern/csv/${locationTag}/${week}.csv`;
    const request = http.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject();
      }

      const body = [];
      response.on('data', chunk => body.push(conv.decode(new Buffer(chunk), 'ISO-8859-1')));
      response.on('end', () => resolve(body.join('')));
    });

    request.on('error', () => reject());
  });
}

function getCurrentWeek() {
  const date = new Date();

  const onejan = new Date(date.getFullYear(), 0, 1);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7);
}

function parseMenu(response) {
  return new Promise((resolve, reject) => {
    parse(response, {
      delimiter: ';',
      columns: true,
    }, (err, out) => {
      if (err) {
        reject(err);
      }

      const cleaned = [];
      if (out) {
        out.forEach((entry) => {
          const item = parser.parseItemFromEntry(entry);
          cleaned.push(item);
        });
      }
      resolve(cleaned);
    });
  });
}

async function updateCacheForLocation(location) {
  const week = getCurrentWeek();

  const response = await downloadMenu(location, week);
  if (response) {
    const menu = await parseMenu(response);

    if (menu) {
      cache.writeMenu(location, menu);
    } else throw new Error('Error parsing the response', response);
  } else throw new Error('Invalid response', response);
}

function updateCache() {
  Provider.LOCATIONS.forEach((location) => {
    updateCacheForLocation(location);
  });
}
exports.updateCache = updateCache;
