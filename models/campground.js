const mongoose = require('mongoose');
const Comment = require('./comment');

//Set up our Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
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

//Pre-hook to delete associated comments when a campground is deleted. 
campgroundSchema.pre('remove', async function() {
    console.log('async function called')
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;