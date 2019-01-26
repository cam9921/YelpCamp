const mongoose = require('mongoose');

//Set up our Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    imageURL: String, 
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;