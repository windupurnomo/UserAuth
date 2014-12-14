//source: http://blog.nodeknockout.com/post/34641712180/sending-email-from-node-js
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "zcode.noreply@gmail.com",
        pass: "hasanalbana"
    }
});

var EmailController = {
    
    resetPassword: function(email, passwordResetHash) {
        smtpTransport.sendMail({
            from: "Z-Code <zcode.noreply@gmail.com>",
            to: email, // comma separated list of receivers
            subject: "Reset Password ZCode Account", // Subject line
            text: "Follow this link to reset password: " // plaintext body
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    },

    sendActivationCode: function(email, activationCode){
        smtpTransport.sendMail({
            from: "Z-Code <zcode.noreply@gmail.com>",
            to: email,
            subject: "Activation Code ZCode Account",
            text: "Your Activation Code is: " + activationCode
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    },

    sendActivationLink: function(email, link){
        smtpTransport.sendMail({
            from: "Z-Code <zcode.noreply@gmail.com>",
            to: email,
            subject: "Activation ZCode Account",
            text: "Activate your account by follow this link: " + link
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    },

    sendMessage: function (email, subject, body){
        smtpTransport.sendMail({
            from: "Z-Code <zcode.noreply@gmail.com>",
            to: email,
            subject: subject,
            text: body
        }, function (error, response){
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    },

    testMessage: function(email) {
        smtpTransport.sendMail({
            from: "Z-Code <zcode.noreply@gmail.com>",
            to: email,
            subject: "Email Test ZCode",
            text: "Sorry.. this is just sample test message from zcode server: "
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    },

};

module.exports = EmailController;