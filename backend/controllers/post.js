const Post = require("../models/post");

exports.getAllPosts = (req, res) => {
    Post.find().sort([['createdAt', -1]]).populate('author').exec((err, posts) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).json(posts)
    })
};

exports.createPost = async (req, res) => {
    const { title, body, authorId } = req.body
    const post = await Post.create({
        title,
        body,
        author: authorId
    })
    return res.status(201).json(post)
};

exports.getPostsByUser = (req, res) => {
    Post.find({ author: req.body.authorId })
    .exec((err, posts) => {
        if (err) console.log(err)
        return res.status(200).json(posts)
    })
}

exports.getOnePost = (req, res) => {
    Post.findById(req.body.postId, (err, post) => {
        if (err) {
            res.status(404).json({ message: "Post not found"})
        }
        return res.status(200).json(post)
    })
}