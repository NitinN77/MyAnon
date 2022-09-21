const express = require("express");
const Post = require("../models/post");
const {
    getAllPosts,
    createPost,
    getPostsByUser,
    getOnePost
} = require("../controllers/post");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get('/getall', getAllPosts)
router.post('/create', protect, createPost)
router.post('/getbyuser', getPostsByUser)
router.post('/getone', getOnePost)

module.exports = router;
