const express = require("express");
const router = express.Router();
const Item = require("../models/Item"); // Import the Item model
const isAuthenticated = require("../middleware/authMiddleware"); // Auth middleware

// Dashboard route - protected by authentication middleware
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.render("dashboard", { user: req.session.user, items }); // Pass user and items to the view
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
