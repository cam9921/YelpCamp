const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      app = express();

mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//Set up our Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    imageURL: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds', {
                campgrounds: campgrounds
            });
        }
    })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const imageURL = req.body.imageURL;
    const newCampground = {
        name: name, 
        imageURL: imageURL
    };

    Campground.create(newCampground, (err, campground) => {
            if(err) {
                console.log(err)
            } else {
                console.log(`Created Campground ${campground.name}`)
                res.redirect('/campgrounds');
            };
        }
    );
});

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})