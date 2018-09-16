'use strict';

var LocalDataHelper = require('../helper/LocalDataHelper');

module.exports = function (app) {
    app.route('/mensa/:location(uni|oth|oth-evening|pruefening)/:day(mo|di|mi|do|fr|sa|so)')
        .get(function (req, res) {
            let locationTag;
            try {
                switch (req.params.location) {
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

                console.log('GET', req.params);

                let content = LocalDataHelper.getCachedMenu(locationTag);
                let filtered = content.filter((item) => item.day === req.params.day);
                res.status(200).json(filtered);
            } catch (err) {
                res.status(200).json({
                    message: "No data available, mensa may be closed."
                });
            }
        });
};