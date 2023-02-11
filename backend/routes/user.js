const express = require("express")

const {
  getAllUsers,
  getCurrUser,
  loginUser,
  registerUser,
} = require("../controllers/user")
const { protect } = require("../middleware/auth")
const { loginUserReq, registerUserReq } = require('../schemas/user')
const { validateReq } = require("../middleware/validator")

const router = express.Router()

router.get("/getall", protect, getAllUsers)
router.post("/login", loginUserReq, validateReq, loginUser)
router.post("/register", registerUserReq, validateReq, registerUser)
router.get("/getcurrent", protect, getCurrUser)

module.exports = router
