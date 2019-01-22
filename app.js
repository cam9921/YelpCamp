const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      seedDB = require('./seeds');
      app = express();

mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

seedDB();

//INDEX route - show all campgrounds
app.get('/campgrounds', (req, res) => {
    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds
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
app.get('/campgrounds/:id/comments/new', (req, res) => {
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

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})