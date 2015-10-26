"use strict"

var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD),
    request = require('request'),
    validator = require('validator'),
    http = require('http');

function sendEmail(fromEmail, fromName, emailBody) {
    sendgrid.send({
        to: 'info@mitrapath.org',
        from: fromEmail,
        subject: 'New Message for Mitra Path from ' + fromName,
        text: emailBody
    }, function(err, json) {
        if (err || !json) {
            console.error(err || "Error, no results");
            try {
                var newEmail = new sendgrid.Email({
                    to: 'brian@hipstertron.com',
                    from: 'info@mitrapath.org',
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
    if (!validator.isEmail(req.body.email)) {
        res.send(401, 'Bad email');
    } else if (!req.body.comment) {
        res.send(401, 'No message')
    } else if (!req.body.name) {
        res.send(401, 'No name')
    } else {
        var commentBody = validator.escape(req.body.comment);
        sendEmail(req.body.email, req.body.name, commentBody);
        res.send(200, 'Ok');
    }
}