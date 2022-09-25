const express = require("express");
const {
    getAllPosts,
    createPost,
    getPostsByUser,
    getOnePost,
    handlePlusOne,
    handleMinusOne
} = require("../controllers/post");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get('/getall', getAllPosts)
router.post('/create', protect, createPost)
router.post('/getbyuser', getPostsByUser)
router.post('/getone', getOnePost)
router.post('/plusone', protect, handlePlusOne)
router.post('/minusone', protect, handleMinusOne)
module.exports = router;
