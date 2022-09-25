const { default: mongoose } = require('mongoose')
const Comment = require('../models/comment')
const Post = require('../models/post')

exports.createComment = async (req, res) => {
    const { body, userId, postId } = req.body
    const comment = await Comment.create({
        body,
        author: mongoose.Types.ObjectId(userId),
        post: mongoose.Types.ObjectId(postId)
    })
    const post = await Post.findById(postId)
    post.comments.push(mongoose.Types.ObjectId(comment.id))
    post.save()
    return res.status(200).json({message: "comment created"})
}