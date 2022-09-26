const express = require("express");
const { createComment } = require('../controllers/comment')
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post('/create', protect,  createComment)
module.exports = router;
