const { default: mongoose } = require("mongoose");
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

exports.handlePlusOne = async (req, res) => {
    const { postId, userId } = req.body
    const post = await Post.findById(postId)
    if (post.plusOnes.map(userid => userid.toString()).includes(userId)) {
        post.plusOnes.remove(userId)
        await post.save()
        return res.status(204).json({message: "plus handled"})
    }
    if (post.minusOnes.map(userid => userid.toString()).includes(userId)) {
        post.minusOnes.remove(userId)
        post.plusOnes.push(mongoose.Types.ObjectId(userId))
        await post.save()
        return res.status(204).json({message: "plus handled"})
    }
    post.plusOnes.push(mongoose.Types.ObjectId(userId))
    await post.save()
    return res.status(204).json({message: "plus handled"})
}

exports.handleMinusOne = async (req, res) => {
    const { postId, userId } = req.body
    const post = await Post.findById(postId)
    if (post.minusOnes.map(userid => userid.toString()).includes(userId)) {
        post.minusOnes.remove(userId)
        await post.save()
        return res.status(204).json({message: "minus handled"})
    }
    if (post.plusOnes.map(userid => userid.toString()).includes(userId)) {
        post.plusOnes.remove(userId)
        post.minusOnes.push(mongoose.Types.ObjectId(userId))
        await post.save()
        return res.status(204).json({message: "minus handled"})
    }
    post.minusOnes.push(mongoose.Types.ObjectId(userId))
    await post.save()
    return res.status(204).json({message: "minus handled"})
}