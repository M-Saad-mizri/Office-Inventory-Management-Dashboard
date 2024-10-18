const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const isAuthenticated = require("../middleware/authMiddleware"); // Import your auth middleware

// Display all items on the dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const items = await Item.find({});
    res.render("dashboard", { items });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Route to display the form for adding a new item
router.get("/items/add", isAuthenticated, (req, res) => {
  // Protect this route
  res.render("addItem"); // Render the add item form view
});

// Add new item
router.post("/items/add", isAuthenticated, async (req, res) => {
  const { name, category, quantity, stockThreshold, redirectTo } = req.body; // Added redirectTo to check where to redirect
  try {
    const newItem = new Item({
      name,
      category,
      quantity,
      stockThreshold,
      addedBy: req.user.id, // Assuming req.user is set after login
    });
    await newItem.save();

    // Check where to redirect after saving the item
    if (redirectTo === "dashboard") {
      return res.redirect("/dashboard"); // Redirect to dashboard
    }
    res.redirect("/items/add"); // Redirect back to add item page
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Delete item
router.post("/items/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id); // Delete the item by ID
    res.redirect("/dashboard"); // Redirect to the dashboard after deletion
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Route to display the form for updating an item
router.get("/items/update/:id", isAuthenticated, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Fetch the item by ID
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("updateItem", { item }); // Render the update item form with the existing item data
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Update item stock
router.post("/items/update/:id", isAuthenticated, async (req, res) => {
  // Protect this route
  const { quantity } = req.body;
  try {
    await Item.findByIdAndUpdate(req.params.id, { quantity });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Highlight low-stock items
router.get("/items/low-stock", async (req, res) => {
  try {
    const items = await Item.find({ quantity: { $lt: 10 } }); // Highlight if stock < 10
    res.render("lowStockReport", { items });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
