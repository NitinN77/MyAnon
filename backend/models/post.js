const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 200,
        minLength: 1
    },
    body: {
        type: String,
        maxLength: 1000
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
});

postSchema.set('timestamps', true)

module.exports = mongoose.model('Post', postSchema);