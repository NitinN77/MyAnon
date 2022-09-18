const express = require("express");
const User = require("../models/user");
const {
  getAllUsers,
  getCurrUser,
  loginUser,
  registerUser,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/getall", protect, getAllUsers);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/getcurrent", protect, getCurrUser);

module.exports = router;
