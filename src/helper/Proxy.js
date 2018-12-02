const parse = require('csv-parse');
const conv = require('iconv-lite');
const http = require('http');

const parser = require('./Parser');
const cache = require('./Cache');

const locations = ['uni', 'oth', 'oth-abend', 'pruefening'];
exports.locations = locations;

function getLocationTag(location) {
  switch (location) {
    case 'uni':
      return 'UNI-R';

    case 'oth':
      return 'HS-R-tag';

    case 'oth-abend':
      return 'HS-R-abend';

    case 'pruefening':
      return 'HS-R-abend';

    default:
      return undefined;
  }
}

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

      //console.log(out);

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
  //console.log('onUpdateLocation', location);

  const locationTag = getLocationTag(location);
  const week = getCurrentWeek();

  const response = await downloadMenu(locationTag, week);
  if (response) {
    const menu = await parseMenu(response);

    if (menu) {
      cache.writeMenu(location, menu);
      //console.log(`${location} cached with success!`);
    } else throw new Error('Error parsing the response', response);
  } else throw new Error('Invalid response', response);
}

function updateCache() {
  locations.forEach((location) => {
    updateCacheForLocation(location);
  });
}
exports.updateCache = updateCache;
