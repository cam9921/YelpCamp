const express = require('express')
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

//INDEX route - show all campgrounds
router.get('/', (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});


//SHOW route - show information on one particular campground.
router.get('/:id', (req, res) => {
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

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {
            campground: foundCampground
        });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findOneAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect(`/campgrounds/${updatedCampground._id}`)
        }
    });
})

//DESTROY campground route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, req.body.campground, (err, foundCampground) => {
        if(err) {
            console.log(err)
            res.redirect('/campgrounds');
        } else {
            //Comments will be dropped in async await function
            //defined in the campground model
            console.log(foundCampground);
            foundCampground.remove();
            res.redirect('/campgrounds');
        }
    });
});

//CREATE route - add new campground to database
router.post('/', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampground = {
        name: name, 
        imageURL: imageURL,
        description: description,
        author: author
    };

    Campground.create(newCampground, (err, campground) => {
            if(err) {
                console.log(err)
            } else {
                console.log(`Created Campground ${campground}`)
                res.redirect('/campgrounds');
            };
        }
    );
});

function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                res.redirect('/campgrounds');
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login')
}

module.exports = router;