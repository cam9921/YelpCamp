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
    imageURL: String, 
    description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX route - show all campgrounds
app.get('/campgrounds', (req, res) => {
    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                campgrounds: campgrounds
            });
        }
    })
});

//NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

//SHOW route - show information on one particular campground.
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {
                campground: foundCampground
            });
        }
    });
});

//CREATE route - add new campground to database
app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const newCampground = {
        name: name, 
        imageURL: imageURL,
        description: description
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