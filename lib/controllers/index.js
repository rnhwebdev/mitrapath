'use strict';

exports.index = function(req, res) {
    res.render('index');
};

exports.sitemap = function(req, res) {
    res.sendfile("sitemap.xml")
};