const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {
    checkCampgroundOwnership: (req, res, next) => {
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
    },
    
    checkCommentOwnership: (req, res, next) => {
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
    }, 

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next(); 
        }
        res.redirect('/login');
    }
};

module.exports = middlewareObj;