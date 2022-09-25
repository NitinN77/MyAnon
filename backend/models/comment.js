const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        maxLength: 500,
        minLength: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post"
    }
});

commentSchema.set('timestamps', true)

module.exports = mongoose.model('Comment', commentSchema);