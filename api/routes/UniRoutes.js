'use strict';
module.exports = function (app) {
    var UniController = require('../controllers/UniController');

    app.route('/mensa/uni/:day')
        .get(UniController.getForDay());
};