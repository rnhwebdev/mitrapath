'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.merge(
    require('./env/all.js')
    /*, I can activate this if I want to set up additional environment specific settings
    require('./env/' + process.env.NODE_ENV + '.js') || {}*/
);