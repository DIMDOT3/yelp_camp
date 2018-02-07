// ==========================================
// SETUP
// ==========================================
var express = require('express'),
    app = express(),
    // body-parser used for getting data from post request body
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    // method-override used to implement PUT/DELETE requests
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    Campground = require("./models/campground"),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require("./seeds");

var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

// ==========================================
// CONFIG
// ==========================================

app.set('view engine', 'ejs');
// Configure app to serve the public directory
app.use(express.static(__dirname + "/public"));
// configure express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Configure express to use method-override
app.use(methodOverride('_method'));
app.use(flash());
// Connect to DB
mongoose.connect("mongodb://localhost/yelp_camp");
// Configure passport for authentication
app.use(require('express-session')({
    secret: 'Once again Rusty wins!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
    // User.[method] comes from passport local mongoose set up in User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure app to use middleware to pass user data to all routes and templates
app.use(function(req, res, next){
    // req.user will be empty or filled with user data, depending on if user is signed in
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

// Configure app to use defined routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Seed the database
// seedDB();



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp has started!");
});