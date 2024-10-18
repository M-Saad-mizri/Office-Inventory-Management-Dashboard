const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stockThreshold: {
    type: Number,
    required: true,
    default: 10, // Default threshold for low stock
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
