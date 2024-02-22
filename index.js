const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
const dotenv = require("dotenv").config();

const asyncHandler = require("express-async-handler");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT;

connectDb();

const app = express();

// middlewares
app.use(cors()); // used to connect frontend fetching of api to the backend. Should be called first
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ============ home ======================================
//@desc Home Page
//@routes GET /home
//@access public
app.get("/", (req, res) => {
   res.render("home/home");
})


// ============= auth routes ==================================

//@desc Load Register Page
//@routes GET /api/users/register
//@access public
app.get("/register", asyncHandler(async(req, res) => {
  let userId = req.user;
  let currentUser;
  await User.findById(userId).then(async (user) => {
    if (user) {
      currentUser = await user.username;
    }
  });
  res.render("auth/register", { currentUser });
}));

//@desc Register a user
//@routes POST /api/users/register
//@access public
app.post("/register", asyncHandler(async (req, res) => {
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
}));

//@desc Load Login Page
//@routes GET /api/users/register
//@access public
app.get("/login", asyncHandler(async(req, res) => {
  return res.render("auth/login");
}));

//@desc Login a user
//@routes POST /api/users/login
//@access public
app.post("/login", asyncHandler(async (req, res) => {
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
}));

app.get('/contactPage', async (req, res) => {
  res.render("contact/contact_query");
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
