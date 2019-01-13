const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let campgrounds = [
    {
        name: 'Gergle Gargle',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSem9E-gtolyMnCAWd8xmE5M_b-ynz4b_0CyIm5FAmWUtM57U1b'
    }, 
    {
        name: 'Dingle Dangle',
        image: 'http://www.freakingnews.com/pictures/82000/Redneck-Kids-Camping--82215.jpg'
    }, 
    {
        name: 'Boofaloof',
        image: 'https://i.pinimg.com/originals/db/7e/af/db7eafab1d65936fce7f5cafa1199d80.png'
    }
];

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {
        campgrounds: campgrounds
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.post('/campgrounds', (req, res) => {
    //Get data from a form and add it to the campgrounds array.
    const name = req.body.name;
    const image = req.body.image;
    let newCampground = {
        name: name,
        image: image
    };
    campgrounds.push(newCampground);
    //Redirect to the campgrounds page.
    res.redirect('/campgrounds');
});

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})