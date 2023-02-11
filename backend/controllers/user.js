const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const { validationResult } = require('express-validator');

const User = require("../models/user")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      console.log(`Error: ` + err)
    } else {
      if (users.length === 0) {
        console.log("No users exist in the database")
      } else {
        return res.json(users)
      }
    }
  })
}

exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ errors: [{ msg: "Incorrect Password" }] })
    throw new Error("Invalid Credentials")
  }
})

exports.getCurrUser = asyncHandler(async (req, res) => {
  const { _id, username, email } = await User.findById(req.user.id)
  res.status(200).json({
    id: _id,
    username,
    email,
  })
})
