const mongoose = require("mongoose");

const creditUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    creditsUsed: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model("CreditUsage", creditUsageSchema);
