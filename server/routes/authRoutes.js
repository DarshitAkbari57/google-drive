const express = require("express");
const { signup, login, logout, me } = require("../controllers/authController");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticate, me);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
