app.get('/', (req, res) => {
    res.render('landing');
});

//===============
//AUTH ROUTES
//===============
app.get('/register', (req, res) => {
    res.render('register');
});

//handle signup logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    res.render('login')
});

//handle login logic
app.post('/login', passport.authenticate('local', 
{
    successRedirect: "/campgrounds",
    failureRedirect: '/login'
}));

//Logout routes
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});
