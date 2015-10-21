'use strict';

var index = require('./controllers/index');
var email = require('./controllers/email');

module.exports = function(app) {
    app.route('/sitemap')
        .get(index.sitemap);

    app.route('/send-email')
        .post(email.submitEmail)

    app.route('*')
        .get(index.index);

};