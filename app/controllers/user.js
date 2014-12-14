var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var email = require('./email');

var userController = {
	findOne: function (category, callback){
		User.findOne(category, function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return callback(err);
                else
                	return callback(null, user);
            }
        );
	},

    register: function (newUser, req, callback){
        // find a user in Mongo with provided username
        var username = newUser.username;
        User.findOne({ 'username' :  username }, function(err, user) {
            // In case of any error, return using the done method
            if (err){
                console.log('Error in SignUp: '+err);
                return callback(err);
            }
            // already exists
            if (user) {
                req.flash('message','User Already Exists')
                return callback(null, {status: false});
            } else {
                newUser.password = createHash(newUser.password);
                newUser.activationCode = makeId(6);
                newUser.save(function(err) {
                    if (err){
                        var msg = 'Error in Saving user: ' + err;
                        console.log(msg);
                        req.flash('message', msg);
                        return callback(err);  
                    }
                    var fullUrl = req.protocol + '://' + req.get('host');
                    var link = fullUrl + "/useractivation?username="+username+"&code="+newUser.activationCode;
                    var title = "Z-Code Activation Account";
                    var body = "Activate your account by follow this link: " + link;
                    email.sendMessage(newUser.email, title, body);
                    req.flash('message', 'Your registeration is success. Check your email to activation.')
                    return callback(null, {status: true, data: newUser});
                });
            }
        });
    },

    resendActivationCode: function (newUser, req, callback){
        // find a user in Mongo with provided username
        var username = newUser.username;
        User.findOne({ 'username' :  username }, function(err, user) {
            // In case of any error, return using the done method
            if (err){
                console.log('Error in SignUp: '+err);
                return callback(err);
            }
            // already exists
            if (user) {
                req.flash('message','User Already Exists')
                return callback(null, {status: false});
            } else {
                newUser.password = createHash(newUser.password);
                newUser.activationCode = makeId(6);
                newUser.save(function(err) {
                    if (err){
                        var msg = 'Error in Saving user: ' + err;
                        console.log(msg);
                        req.flash('message', msg);
                        return callback(err);  
                    }
                    var fullUrl = req.protocol + '://' + req.get('host');
                    var link = fullUrl + "/useractivation?username="+username+"&code="+newUser.activationCode;
                    var title = "Z-Code Activation Account";
                    var body = "Activate your account by follow this link: " + link;
                    email.sendMessage(newUser.email, title, body);
                    req.flash('message', 'Your registeration is success. Check your email to activation.')
                    return callback(null, {status: true, data: newUser});
                });
            }
        });
    },

	activation: function (username, code, callback){
		User.update({username: username, activationCode: code}, {status: 1}, function(err, affectedRow){
            if (err) return callback(err);
            
            if(affectedRow === 1){
                var category = {username: username};
                User.findOne(category, function(err, user) {
		                if (err)
		                    return callback(err);
		                else
		                	return callback(null, user);
		            }
		        );
            }else{
                return callback("affected row is not one", null);
            }
        });
	},
};

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var makeId = function (n)
{
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

module.exports = userController;