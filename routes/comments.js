const express = require('express')
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ======================================================
// COMMENTS ROUTES

//New comment route
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login')
}

module.exports = router;