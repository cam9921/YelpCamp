const express = require('express')
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

//NEW comment route
router.get('/new', isLoggedIn, (req, res) => {
    console.log(req.params.id);
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


//CREATE comment route
router.post('/', isLoggedIn, (req, res) => {
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
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                console.log(`New comment from ${req.user.username}`);
                comment.save();
                //save comment
                campground.comments.push(comment);
                campground.save();
                console.log(comment)
                res.redirect(`/campgrounds/${campground._id}`);
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login')
}

module.exports = router;