//External dependencies
const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      flash = require('connect-flash'),
      LocalStrategy = require('passport-local'), 
      methodOverride = require('method-override');

//Local dependencies
const Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      authRoutes = require('./routes/index'),
      commentRoutes = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      seedDB = require('./seeds');

//Init app
const app = express();

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//To seed DB if needed.
// seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Dingalshgawoeijrsldkgjhs;dlafkjsdf",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

//Flash configuration
// app.configure(function() {
//     app.use(express.cookieParser('keyboard cat'));
//     app.use(express.session({ cookie: { maxAge: 60000 }}));
//     app.use(flash());
// });

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})