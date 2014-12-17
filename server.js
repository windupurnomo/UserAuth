global.rootRequire = function(name) {
	return require(__dirname + '/' + name);
}

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var port = process.env.PORT || 8091; // process.env.PORT lets the port be set by Heroku
var duration = 180;
var passport = require('passport');
var expressSession = require('express-session');
var matchDetails = [];
var path = require('path');
var socketIo = require('./app/socket/socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(expressSession({
    secret: 'keeplearningxu8479jasd',
    cookie: {maxAge: 10000},
    rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());
var flash = require('connect-flash');
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/controller'));
socketIo.set(io);

// Initialize Passport
require('./app/controllers/passport')(passport);
var routes = require('./routes/index')(passport);
app.use('/', routes);

var mongoose = require('mongoose');
mongoose.connect(config.db.url);

app.use(favicon(__dirname + '/public/img/favicon.ico'));

process.on('uncaughtException', function (err) {
	console.log(err);
});

// app.listen(port, '0.0.0.0', function() {
//     console.log('listening on *: ' + port);
// });
http.listen(port, '0.0.0.0', function() {
    console.log('listening on *: ' + port);
});