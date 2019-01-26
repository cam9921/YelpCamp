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
    res.render('login')
});

//handle login logic
router.post('/login', passport.authenticate('local', 
{
    successRedirect: "/campgrounds",
    failureRedirect: '/login'
}));

//Logout routes
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds')
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login')
}

module.exports = router;