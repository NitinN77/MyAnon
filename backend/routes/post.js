const express = require("express")

const {
    getAllPosts,
    createPost,
    getPostsByUser,
    getOnePost,
    handlePlusOne,
    handleMinusOne,
    deletePost,
    updatePost
} = require("../controllers/post")

const {
    createPostReq,
    getPostByIdReq,
    getPostByUserIdReq,
    handlePlusOrMinusReq,
    deletePostReq,
    updatePostReq
} = require('../schemas/post')

const { protect } = require("../middleware/auth")
const { validateReq } = require("../middleware/validator")


const router = express.Router()

router.get('/getall', getAllPosts)
router.post('/create', protect, createPostReq, validateReq, createPost)
router.get('/getbyuserid/:userId', getPostByUserIdReq, validateReq, getPostsByUser)
router.get('/getbyid/:postId', getPostByIdReq, validateReq, getOnePost)
router.post('/plusone', protect, handlePlusOrMinusReq, validateReq, handlePlusOne)
router.post('/minusone', protect, handlePlusOrMinusReq, validateReq, handleMinusOne)
router.post('/delete', protect, deletePostReq, validateReq, deletePost)
router.post('/update', protect, updatePostReq, validateReq, updatePost)

module.exports = router
