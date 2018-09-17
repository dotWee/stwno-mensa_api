const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const expressSwagger = require('express-swagger-generator')(app);
const LocalDataHelper = require('./helper/LocalDataHelper');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// add controller
require('./controllers/Controller')(app);

app.listen(port);

// define update job
function updateLocal() {
  console.log('Updating local cache');
  LocalDataHelper.performUpdateAll();
}
setInterval(updateLocal, 1000 * 60 * 60 * 24);

// and execute update on startup
updateLocal();

// add swagger
let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.2.0',
    },
    host: 'localhost:3000',
    basePath: '/v1',
    produces: [
      'application/json',
    ],
    schemes: ['http', 'https'],
  },
  basedir: __dirname,
  files: ['./models/Item.js'],
};
expressSwagger(options);

console.log(`Uni-oth_mensa_api started on port: ${port}`);
console.log(`Try http://localhost:${port}/mensa/uni/mo`);
