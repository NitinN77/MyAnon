const express = require("express")
const { createComment } = require('../controllers/comment')
const { protect } = require("../middleware/auth")
const { createCommmentReq } = require('../schemas/comment')
const { validateReq } = require('../middleware/validator')

const router = express.Router()

router.post('/create', protect, createCommmentReq, validateReq, createComment)

module.exports = router
