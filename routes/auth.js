const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Signup Route (GET)
router.get("/signup", (req, res) => {
  res.render("signup"); // Ensure you have a signup.ejs view
});

// Signup Route (POST)
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists");
    }
    user = new User({ name, email, password });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Login Route (GET)
router.get("/login", (req, res) => {
  res.render("login"); // Ensure you have a login.ejs view
});

// Login Route (POST)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    req.session.user = user; // Store user in session
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
