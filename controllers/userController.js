const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@routes POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { username, email, password } = req.body;
  const secPass = await bcrypt.hash(req.body.password, salt);

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  bcrypt.hash(req.body.password, salt).then((hash) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        console.log(user);
        res.status(201).json({
          message: "User added successfully!",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
  // res.json({ user });
});

//@desc Load Register Page
//@routes GET /api/users/register
//@access public
const getRegisterPage = asyncHandler(async(req, res) => {
  return res.render("auth/register");
});

//@desc Login a user
//@routes POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
  res.json({ message: "Login user" });
});

//@desc Load Login Page
//@routes GET /api/users/register
//@access public
const getLoginPage = asyncHandler(async(req, res) => {
  return res.render("auth/login");
});

//@desc Current user info
//@routes POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);  
});

module.exports = { registerUser, loginUser, currentUser, getRegisterPage, getLoginPage };
