const { default: mongoose } = require("mongoose")
const Post = require("../models/post")
const Comment = require("../models/comment")


exports.getAllPosts = (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber)
  Post.find()
    .sort({ createdAt: -1, _id: 1 })
    .limit(3)
    .skip(pageNumber > 0 ? (pageNumber - 1) * 3 : 0)
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        console.log(err)
      }
      return res.status(200).json({
        posts,
        pageNumber,
      })
    })
}

exports.createPost = async (req, res) => {
  const { title, body, authorId } = req.body
  const post = await Post.create({
    title,
    body,
    author: authorId,
  })
  return res.status(201).json(post)
}

exports.getPostsByUser = (req, res) => {
  Post.find({ author: req.params.userId }).exec((err, posts) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err)
    }
    return res.status(200).json(posts)
  })
}

exports.getOnePost = (req, res) => {
  Post.findById(req.params.postId)
    .populate("author")
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .exec((err, post) => {
      if (err) {
        res.status(404).json({ message: "Post not found" })
      }
      return res.status(200).json(post)
    })
}

exports.handlePlusOne = async (req, res) => {
  const { postId, userId } = req.body
  const post = await Post.findById(postId)
  if (post.plusOnes.map((userid) => userid.toString()).includes(userId)) {
    post.plusOnes.remove(userId)
    await post.save()
    return res.status(204).json({ message: "plus handled" })
  }
  if (post.minusOnes.map((userid) => userid.toString()).includes(userId)) {
    post.minusOnes.remove(userId)
    post.plusOnes.push(mongoose.Types.ObjectId(userId))
    await post.save()
    return res.status(204).json({ message: "plus handled" })
  }
  post.plusOnes.push(mongoose.Types.ObjectId(userId))
  await post.save()
  return res.status(204).json({ message: "plus handled" })
}

exports.handleMinusOne = async (req, res) => {
  const { postId, userId } = req.body
  const post = await Post.findById(postId)
  if (post.minusOnes.map((userid) => userid.toString()).includes(userId)) {
    post.minusOnes.remove(userId)
    await post.save()
    return res.status(204).json({ message: "minus handled" })
  }
  if (post.plusOnes.map((userid) => userid.toString()).includes(userId)) {
    post.plusOnes.remove(userId)
    post.minusOnes.push(mongoose.Types.ObjectId(userId))
    await post.save()
    return res.status(204).json({ message: "minus handled" })
  }
  post.minusOnes.push(mongoose.Types.ObjectId(userId))
  await post.save()
  return res.status(204).json({ message: "minus handled" })
}

exports.deletePost = async (req, res) => {
  const { postId, userId } = req.body
  const post = await Post.findById(postId)
  if (!post) {
    return res.status(404)
  }
  if (userId === req.user.id && post.author.toString() === userId) {
    await Comment.deleteMany({
      post: mongoose.Types.ObjectId(postId),
    })
    await Post.findByIdAndDelete(postId)
    return res.status(200).json({ message: "deleted successfully" })
  } else {
    return res.status(404).json({ message: "invalid delete request" })
  }
}

exports.updatePost = async (req, res) => {
  const { postId, userId, newBody } = req.body
  const post = await Post.findById(postId)
  if (!post) {
    return res.status(404)
  }
  if (userId === req.user.id && post.author.toString() === userId) {
    post.body = newBody
    await post.save()
    return res.status(200).json({ message: "updated successfully" })
  } else {
    return res.status(404).json({ message: "invalid update request" })
  }
}
