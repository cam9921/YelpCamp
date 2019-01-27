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
                comment.save();
                //save comment
                campground.comments.push(comment);
                campground.save();
                res.redirect(`/campgrounds/${campground._id}`);
            });
        }
    });
});

//Comments edit route
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render('comments/edit', {
            campground_id: req.params.id, 
            comment: foundComment
        });
    });
});

//Comments update route
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect(`back`)
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
});

//Comments destroy route
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('/campgrounds');
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
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