'use strict';

var LocalDataHelper = require('../helper/LocalDataHelper');

function fetchMenu(locationParam, dayParam) {
    let locationTag;
    
    switch (locationParam) {
        case 'uni':
            locationTag = LocalDataHelper.LOCATION_UNI;
            break;
        case 'oth':
            locationTag = LocalDataHelper.LOCATION_OTH;
            break;

        case 'oth-abend':
            locationTag = LocalDataHelper.LOCATION_OTH_ABEND;
            break;

        case 'pruefening':
            locationTag = LocalDataHelper.LOCATION_PRUEFENING;
            break;
    }

    let menu = LocalDataHelper.getCachedMenu(locationTag);
    return (dayParam ? menu.filter((item) => item.day === dayParam) : menu);
}

function menu(req, res) {
    console.log('GET', req.params);

    try {
        let menu = fetchMenu(req.params.location, req.params.day);
        res.status(200).json(menu);
    } catch(err) {
        res.status(200).json({
            message: "No data available, mensa may be closed."
        });
    }
}

module.exports = function (app) {
    app.route('/').get(function (req, res) {
        res.redirect(301, 'https://github.com/dotWee/uni-oth_mensa_api');
    });

    app.route('/mensa/:location(uni|oth|oth-evening|pruefening)')
        .get(menu);

    app.route('/mensa/:location(uni|oth|oth-evening|pruefening)/:day(monday|tuesday|wednesday|thursday|friday|saturday|sunday)')
        .get(menu);
};