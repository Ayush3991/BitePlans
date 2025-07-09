const mongoose = require("mongoose");

const currentPlanSchema = new mongoose.Schema({
  planId: String, // 'trial', 'starter', 'pro', etc.
  status: String, // 'active', 'expired'
  startDate: Date,
  endDate: Date,
}, { _id: false });

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  displayName: String,
  profileImage: String,
  
  // Credits & Trial
  totalCredits: {
    type: Number,
    default: 0,
  },
  usedCredits: {
    type: Number,
    default: 0,
  },
  trialStartDate: Date,
  trialEndDate: Date,
  isTrialActive: {
    type: Boolean,
    default: true,
  },

  // Current Plan
  currentPlan: currentPlanSchema,

  preferences: {
    theme: {
      type: String,
      default: "light",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);