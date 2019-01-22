const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: "Gergle Gargle",
        imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSem9E-gtolyMnCAWd8xmE5M_b-ynz4b_0CyIm5FAmWUtM57U1b",
        description: "A gud place fer gerglin adn a gud place fer garglin" 
    }, 
    {
        name: "Dingle Dangle",
        imageURL: "http://www.freakingnews.com/pictures/82000/Redneck-Kids-Camping--82215.jpg",
        description: "Dingle yer dangler on dem dingly doo-dads" 
    }, 
    {
        name: "Boofaloof",
        imageURL: "https://i.pinimg.com/originals/db/7e/af/db7eafab1d65936fce7f5cafa1199d80.png",
        description: "Boof just means flatulence" 
    }, 
    {
        name: "The Fart Barn",
        imageURL: "https://c1.staticflickr.com/5/4101/4755392638_51f7360d80_b.jpg",
        description: "Yall really need me ta tell ya??"
    }, 
    {
        name: "The Wrasslin' Pit",
        imageURL: "http://exiledonline.com/wp-content/uploads/2008/10/rt_redneck5_070709_ssh.jpg",
        description: "Where honer is wun"
    }, 
    {
        name: "Drinky Stinky",
        imageURL: "http://4.bp.blogspot.com/-W6xNn-DOZ6E/UhZDSNMI02I/AAAAAAAANIs/GM5kjSLCZ7Y/s1600/redneck+bud.jpg",
        description: "Drink a true 'merican beer wit a stinky feller"  
    }, 
];

function seedDB() {
    //Remove all sites
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log('removed campgrounds');
        Comment.remove({}, (err) => {
            if(err) {
                console.log(err);
            }
            console.log('Removed comments!');
            //Seed new data
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Added a campground');
                        //Create a comment
                        Comment.create({
                                    text: 'Feckin love this place', 
                                    author: 'Me'
                                }, (err, comment) => {
                                    if(err) {
                                        console.log(err)
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();  
                                        console.log('Created new comments')
                                    }
                                });
                    }
                });
            });  
        });
    });
};

module.exports = seedDB;