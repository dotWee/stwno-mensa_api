'use strict';

var ResourceHelper = require('../helper/ResourceHelper');

var DAYS_ACCEPTED = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];

module.exports.getForDay = function () {
    return function(req, res) {
        var day = req.params.day;
        if (DAYS_ACCEPTED.includes(day)) {
            // cont
            res.status(200).json(day);
        } else {
            res.status(400).send('Specified day is invalid. Accepted are: ' + JSON.stringify(DAYS_ACCEPTED));
        }

        ResourceHelper.fetchMenu(ResourceHelper.LOCATION_TAGS[0], ResourceHelper.getCurrentWeek());
    };
};