const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
  },
  planName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
  },
  creditsPerMonth: {
    type: Number,
    required: true, // -1 for unlimited
  },
  paypalPlanId: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Plan", planSchema);
