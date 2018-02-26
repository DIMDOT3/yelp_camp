var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');

// ---------------------------
// CAMPGROUNDS ROUTES
// ---------------------------

// INDEX ROUTE - show all campgrounds
router.get('/', function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
    var location = req.body.location;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW Route - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('campgrounds/new'); 
});

// SHOW Route - Display information about a specific campground
router.get('/:id', function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground data
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT Route - Show page for edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash('error', 'Campground not found.');
            res.redirect('back');
        } else {
            // don't need to handle err b/c Campground.findById() already ran in middleware
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

// UPDATE Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: req.body.location};
        // find and update correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if(err){
                req.flash('error', 'Campground not found.'); 
                res.redirect('/campgrounds');
            } else {
                req.flash('success', 'You successfully updated the campground!');
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
});

// DESTROY Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;