const express = require('express')
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/index');

//NEW comment route
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render('comments/edit', {
            campground_id: req.params.id, 
            comment: foundComment
        });
    });
});

//Comments update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    console.log(req.params.comment_id, req.body.comment)
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        console.log('Comment changed', updatedComment)
        if(err) {
            res.redirect(`/`)
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
});

//Comments destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;