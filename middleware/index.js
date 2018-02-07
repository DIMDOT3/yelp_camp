var Campground = require('../models/campground'),
    Comment = require('../models/comment');

// all the middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // check if user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash('error', 'Campground not found.');
               res.redirect('back');
           } else {
               // does user own campground?
               //foundComment.author.id returns an object | req.user.id returns a string
                // so use equal() method to check for equality
               if(foundCampground.author.id.equals(req.user._id)){
                    next();
               } else {
                   req.flash('error', "You don't have permission to do that.");
                  res.redirect('back');                     
               }
           }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // check if user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect('back');
           } else {
               // does user own comment?
                //foundComment.author.id returns an object | req.user.id returns a string
                // so use equal() method to check for equality
               if(foundComment.author.id.equals(req.user._id)){
                    next();
               } else {
                   req.flash('error', "You don't have permission to do that!");
                  res.redirect('back');                     
               }
           }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }  
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // flash message will have to be handled in route and template
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('/login');
};

module.exports = middlewareObj;