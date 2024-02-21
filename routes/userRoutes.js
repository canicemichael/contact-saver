const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  getRegisterPage,
  getLoginPage,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/register", getRegisterPage);

router.post("/register", registerUser);

router.get('/login', getLoginPage);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

module.exports = router;
