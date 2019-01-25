const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      flash = require('connect-flash'),
      LocalStrategy = require('passport-local'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      seedDB = require('./seeds');
      app = express();

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

seedDB();

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

//Flash configuration
// app.configure(function() {
//     app.use(express.cookieParser('keyboard cat'));
//     app.use(express.session({ cookie: { maxAge: 60000 }}));
//     app.use(flash());
// });

app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX route - show all campgrounds
app.get('/campgrounds', (req, res) => {
    console.log(req.user)
    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    })
});

//NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


//SHOW route - show information on one particular campground.
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {
                campground: foundCampground
            });
        }
    });
});

//CREATE route - add new campground to database
app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const newCampground = {
        name: name, 
        imageURL: imageURL,
        description: description
    };

    Campground.create(newCampground, (err, campground) => {
            if(err) {
                console.log(err)
            } else {
                console.log(`Created Campground ${campground.name}`)
                res.redirect('/campgrounds');
            };
        }
    );
});

// ======================================================
// COMMENTS ROUTES

//New comment route
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err)
        } else {
            res.render('comments/new', {
                campground: foundCampground
            });
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            Comment.create({
                text: req.body.comment.content, 
                author: req.body.comment.author
            }, (err, comment) => {
                campground.comments.push(comment);
                campground.save();
                res.redirect(`/campgrounds/${campground._id}`);
            });
        }
    });
});

//===============
//AUTH ROUTES
//===============
app.get('/register', (req, res) => {
    res.render('register');
});

//handle signup logic
app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

//Show Login form
app.get('/login', (req, res) => {
    res.render('login')
});

//handle login logic
app.post('/login', passport.authenticate('local', 
{
    successRedirect: "/campgrounds",
    failureRedirect: '/login'
}));

//Logout routes
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login')
}

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})