const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const dotenv = require("dotenv").config();

const asyncHandler = require("express-async-handler");
const {User} = require("./models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// important models
const funct = require("./config/funct");

// importing functions
let verification_code = funct.verification_code,
reset_code = funct.reset_code;

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
});

// ============= auth routes ==================================

//@desc Load Register Page
//@routes GET /api/users/register
//@access public
app.get(
  "/register",
  asyncHandler(async (req, res) => {
    let userId = req.user;
    let currentUser;
    await User.findById(userId).then(async (user) => {
      if (user) {
        currentUser = await user.username;
      }
    });
    res.render("auth/register", { currentUser });
  })
);

//@desc Register a user
//@routes POST /api/users/register
//@access public
// app.post(
//   "/register",
//   asyncHandler(async (req, res) => {
//     const salt = await bcrypt.genSalt(10);
//     const { username, email, password, password2 } = req.body;
//     const secPass = await bcrypt.hash(req.body.password, salt);

//     let errors = [];

//     if (!username || !email || !password || !password2) {
//       res.status(400);
//       throw new Error("All fields are mandatory");
//     }
//     if (password != password2) {
//       errors.push({ msg: "Passwords do not match" });
//     }
//     if (password.length < 8) {
//       errors.push({ msg: "Password must be at least 8 characters" });
//     }

//     if (errors.length > 0) {
//       res.render("auth/register", {
//         errors,
//         email,
//         password,
//         password2,
//       });
//     } else {
//       req.body.username = username;
//       req.body.email = email;
//       User.findOne({ email }).then(async (user) => {
//         if (user) {
//           errors.push({
//             msg: "An account with this email already exists.",
//           });
//           return res.render("auth/login", { errors });
//         } else {
//           bcrypt.hash(req.body.password, salt).then((hash) => {
//             const user = new User({
//               username: req.body.username,
//               email: req.body.email,
//               password: hash,
//             });
//             user
//               .save()
//               .then(() => {
//                 console.log(user);
//                 // welcome_mail(new_user);
//                 // req.flash("success_msg", "Account created, Please login");
//                 return res.redirect("/login");
//               })
//               .catch((err) => {
//                 res.status(500).json({
//                   error: err,
//                 });
//               });
//           });
//         }
//       });
//     }
//   })
// );

app.post("/register", (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];
  if (!username || !email || !password || !password2) {
    errors.push({ mes: "Please enter all fields" });
    console.log(errors);
  }
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      email,
      password,
      password2,
    });
  } else {
    req.body.username = email;
    User.findOne({ email }).then(async (user) => {
      if (user) {
        errors.push({
          msg: "An account with this email already exists. Please login",
        });
        return res.render("auth/login", { errors });
      } else {
        req.body.verification_code = verification_code();

        User.register(new User(req.body), password)
          .then((new_user) => {
            // welcome_mail(new_user);
            req.flash("success_msg", "Account created, Please login");
            return res.redirect("/login");
          })
          .catch((err) => {
            errors.push({ msg: "Something went wrong" });
          });
      }
    });
  }
});

//@desc Load Login Page
//@routes GET /api/users/register
//@access public
app.get(
  "/login",
  asyncHandler(async (req, res) => {
    return res.render("auth/login");
  })
);

//@desc Login a user
//@routes POST /api/users/login
//@access public
app.post(
  "/login",
  asyncHandler(async (req, res) => {
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
      // res.status(200).json({ accessToken });
      // save the tokens local storage or something
      return res.render("contact/contact_query");
    } else {
      res.status(401);
      throw new Error("email or password is not valid");
    }
    res.json({ message: "Login user" });
  })
);

// ============= contact routes =================

app.get("/contactPage", async (req, res) => {
  res.render("contact/contact_query");
});

app.get("/contactPage/createContact", async (req, res) => {
  res.render("contact/create_contact");
});

app.get("/contactPage/getContact", async (req, res) => {
  res.render("contact/get_contact");
});

app.get("/contactPage/fetchContacts", async (req, res) => {
  res.render("contact/fetch_contacts");
});

app.get("/contactPage/updateContact", async (req, res) => {
  res.render("contact/update_contact");
});

app.get("/contactPage/deleteContact", async (req, res) => {
  res.render("contact/delete_contact");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
