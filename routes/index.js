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
    res.render('register', {page: 'register'});
});

//handle signup logic
router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            // req.flash('error', `${err.name}: ${err.message}`);
            return res.render('register', {error: err.message});
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to Y'allp Camp, ${user.username}!`)
            res.redirect('/campgrounds');
        });
    });
});

//Show Login form
router.get('/login', (req, res) => {
    res.render('login', {
        referer: req.headers.referer, 
        page: 'login'
    });
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
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds')
});

module.exports = router;