"use strict"

var sendgrid = require('sendgrid')('process.env.SENDGRID_USERNAME', 'process.env.SENDGRID_PASSWORD'),
    request = require("request"),
    validator = require('validator'),
    http = require('http');

/**
 * sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD),
 * Express configuration
 * Justification for handling emails here: the python server harvests the data, cleans it, and sends it here. Node handles all else. Python is data only.
 **/

function sendEmail(fromEmail, subjectBody) {
    sendgrid.send({
        to: 'aristekrat@gmail.com',
        from: fromEmail,
        subject: 'Mitra Path Email',
        text: subjectBody
    }, function(err, json) {
        if (err || !json) {
            console.error(err || "Error, no results");
            try {
                var newEmail = new sendgrid.Email({
                    to: 'brian@hipstertron.com',
                    from: 'aristekrat@gmail.com',
                    subject: 'Email Error',
                    text: 'Check the server logs'
                });
                sendgrid.send(newEmail)
            } catch (e) {
                throw ReferenceError
            }
        } else {
            console.log(json)
        }
    });
}

exports.submitEmail = function(req, res) {
    if (validator.isEmail(req.body.email)) {
        var commentBody = validator.escape(req.body.comment);
        sendEmail(req.body.email, commentBody);
        res.send(200, 'Ok');
    } else {
        res.send(401, 'Bad email');
    }
}