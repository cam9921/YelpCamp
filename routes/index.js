const express = require('express')
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//Landing page
router.get('/', (req, res) => {
    res.render('landing');
});

//Register route
router.get('/register', (req, res) => {
    res.render('register');
});

//handle signup logic
router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => {
    res.render('login', {
        referer: req.headers.referer, 
        message: req.flash('error')
    })
});

//handle login logic
router.post('/login', passport.authenticate('local', 
{
    failureRedirect: '/login'
}), (req, res) => {
    if(req.body.referer && req.body.referer !== undefined) {
        res.redirect(req.body.referer);
    } else {
        res.redirect('/campgrounds')
    }
});

//Logout routes
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds')
});

module.exports = router;