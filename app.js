const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
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
    ]
    res.render('campgrounds', {
        campgrounds: campgrounds
    });
});

app.listen(3000, () => {
    console.log('Server Started on port 3000');
})