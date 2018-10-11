const parse = require('csv-parse');
const conv = require('iconv-lite');
const http = require('http');

const ItemModel = require('../models/Item');

function getSourceUrl(locationTag, week) {
  return `http://www.stwno.de/infomax/daten-extern/csv/${locationTag}/${week}.csv`;
}

function getContent(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed to load page, error: ${response.statusCode} Url: ${url}`));
      }
      const body = [];
      response.on('data', chunk => body.push(conv.decode(new Buffer(chunk), 'ISO-8859-1')));
      response.on('end', () => resolve(body.join('')));
    });

    request.on('error', err => reject(err));
  });
}

function getCurrentWeek() {
  const date = new Date();

  const onejan = new Date(date.getFullYear(), 0, 1);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7);
}

exports.getCurrentWeek = getCurrentWeek;

async function fetchMenuAsync(locationTag, week) {
  const url = getSourceUrl(locationTag, week);
  const response = await getContent(url);
  return response;
}
exports.fetchMenuAsync = fetchMenuAsync;

function parseDay(value) {
  let day;

  switch (value.toLowerCase()) {
    case 'mo':
      day = 'monday';
      break;

    case 'di':
      day = 'tuesday';
      break;

    case 'mi':
      day = 'wednesday';
      break;

    case 'do':
      day = 'thursday';
      break;

    case 'fr':
      day = 'friday';
      break;

    case 'sa':
      day = 'saturday';
      break;

    case 'so':
      day = 'sunday';
      break;

    default:
      throw new Error('Could not parse day from value', value);
  }

  return day;
}

function parseIngredients(value) {
  let ingredients = [];

  const rawIngredients = value.match(/(?=\().+?(?:\))/);
  if (rawIngredients && rawIngredients[0]) {
    ingredients = rawIngredients[0].replace(/[{()}]/g, '').split(',');
  }
  return ingredients;
}

function parseItemFromEntry(item) {
  return new ItemModel.Item(
    item.name.replace(/(?=\().+?(?:\))/g, '').trim(),
    item.date,
    parseDay(item.tag),
    item.warengruppe,
    item.kennz.split(','),
    parseIngredients(item.name),
    { students: item.stud, employees: item.bed, guests: item.gast },
  );
}

function parseMenuPromise(response) {
  return new Promise((resolve, reject) => {
    parse(response, {
      delimiter: ';',
      columns: true,
    }, (err, out) => {
      if (err) {
        reject(err);
      }

      const cleaned = [];
      out.forEach((entry) => {
        const itemObj = parseItemFromEntry(entry);
        cleaned.push(itemObj);
      });

      resolve(cleaned);
    });
  });
}

exports.parseMenu = parseMenuPromise;
