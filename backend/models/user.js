const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 20,
        minLength: 3
    },
    lastName: {
        type: String,
        maxLength: 30,
        minLength: 3
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid.']
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Post"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],
});

module.exports = mongoose.model('User', userSchema);