var express = require('express');
var authRoutes = require('./auth');
var router = express.Router();
var helper = rootRequire('app/helper/helper');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}


module.exports = function(passport) {
    
    router.get('/admin', isAuthenticated, function(req, res) {
        var matches = helper.matchProcessor.getMatch();
        res.render('admin', {
            username: req.user.username,
            message: req.flash('message')
        });
    });

    router.get('/', isAuthenticated, function(req, res) {
        var matches = helper.matchProcessor.getMatch();
        res.render('index', {
            username: req.user.username,
            message: req.flash('message')
        });
    });

    router.get('/t', function (req, res){
        var fullUrl = req.protocol + '://' + req.get('host');
        res.send(fullUrl);
    });

    authRoutes(router, passport);

    return router;
}