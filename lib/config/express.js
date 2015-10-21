'use strict';

var express = require('express'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config');

/**
 * Express configuration
 */
module.exports = function(app) {
    var env = app.get('env');

    if ('development' === env) {
        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/js/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        app.use(express.static(path.join(config.root, 'app')));
        app.set('views', config.root + '/app');
    }

    if ('production' === env) {
        app.use(compression());
        app.use(function setJSCache(req, res, next) {
            if (req.url.indexOf('/') === 0) {
                res.header('Cache-Control', 'public, max-age=645600');
                res.header('Expires', new Date(Date.now() + 3456000000).toUTCString());
            }
            next();
        });
        app.use(function setJSCache(req, res, next) {
            if (req.url.indexOf('app/dist') === 0) {
                res.header('Cache-Control', 'public, max-age=645600');
                res.header('Expires', new Date(Date.now() + 3456000000).toUTCString());
            }
            next();
        });
        app.use(function setCSSCache(req, res, next) {
            if (req.url.indexOf('/css/') === 0) {
                res.header('Cache-Control', 'public, max-age=3456000');
                res.header('Expires', new Date(Date.now() + 345600000).toUTCString());
            }
            next();
        });
        app.use(function setImgCache(req, res, next) {
            if (req.url.indexOf('/img/') === 0) {
                res.header('Cache-Control', 'public, max-age=3456000');
                res.header('Expires', new Date(Date.now() + 3456000000).toUTCString());
            }
            next();
        });
        app.use(express.static(path.join(config.root, 'app')));
        app.set('views', config.root + '/app');
    }

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(cookieParser());

    // Error handler - has to be last
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
};