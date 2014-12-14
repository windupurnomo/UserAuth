var user = rootRequire('/app/controllers/user');
var userModel = rootRequire('/app/models/user');
var validator = require('validator');

module.exports = function (router, passport){

	router.get('/login', function (req, res){
		res.render('auth/login', {message: req.flash('message')});
	});

    router.get('/register', function (req, res){
        res.render('auth/register', {message: req.flash('message')});
    });

	/* Handle Login POST */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    /* Handle Registration POST */
    // router.post('/register', passport.authenticate('local-signup', {
    //     successRedirect: '/registersuccess',
    //     failureRedirect: '/register',
    //     failureFlash: true
    // }));

    router.post('/register', function (req, res){
        var newUser = new userModel();
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.email = req.body.email;
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;

        if (validator.isNull(newUser.username)){
            res.render('auth/register', {
                message: 'username can not null'
            });
        }else if (validator.isNull(newUser.password)){
            res.render('auth/register', {
                message: 'password can not null'
            });
        }else if (validator.isNull(newUser.email)){
            res.render('auth/register', {
                message: 'email can not null'
            });
        }else if (validator.isNull(newUser.firstName)){
            res.render('auth/register', {
                message: 'first name can not null'
            })
        }else if (validator.isNull(newUser.lastName)){
            res.render('auth/register', {
                message: 'last name can not null'
            })
        }else if (!validator.isEmail(newUser.email)){
            res.render('auth/register', {
                message: 'email is not valid'
            })
        }else if (!validator.isLength(newUser.username, 4)){
            res.render('auth/register', {
                message: 'username length minimum is 7 characaters'
            });
        }else{
            user.register(newUser, req, function (err, result){
                if (err || !res.status) {
                    res.redirect('/register');
                }
                else{
                    res.redirect('/registersuccess');
                }
            })
        }
    });

    router.get('/registersuccess', function (req, res){
        res.render('auth/register-success');
    });
    
    /* Handle Logout */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/resendemailactivation', function (req, res){
        res.redirect('/registersuccess');
    });

    router.get('/useractivation', function (req, res){
        var username = req.query.username;
        var code = req.query.code;
        user.activation(username, code, function (err, user){
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });    
        });
        
    });
};