var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// ==========================================
// ROUTES
// ==========================================

router.get('/', function(req, res){
    res.render("landing");    
});


// ---------------------------
// AUTH ROUTES
// ---------------------------

// SHOW - sign up form
router.get('/register', function(req,res){
   res.render('register'); 
});

// Handle sign up logic
router.post('/register', function(req, res){
    // User.register() method provided by passport local mongoose in User model
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err.message);
           req.flash("error", err.message + '.');
           return res.redirect('/register');
       }
       passport.authenticate('local')(req, res, function(){
          req.flash('success', "Welcome to YelpCamp " + user.username);
          res.redirect('/campgrounds'); 
       });
    });
});

// SHOW - login form
router.get('/login', function(req, res){
   res.render('login'); 
});

// Handle login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});

// Handle logout logic
router.get('/logout', function(req, res){
    // logout method included in passport packages installed 
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

module.exports = router;