const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  benefits: {
    type: [String],
    required: true,
  },

  creditCost: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model("Product", productSchema);
