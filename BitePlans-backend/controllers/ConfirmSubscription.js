const Plan = require("../models/Plan");
const User = require('../models/User');
const axios = require("axios");
const { getPayPalAccessToken } = require("../config/paypal");
const Transaction = require("../models/Transaction");

// POST /api/v1/plans/confirm-subscription
const confirmSubscription = async (req, res) => {
  try {
    const { orderId, planId } = req.body;

    if (!orderId || !planId) {
      return res.status(400).json({ success: false, message: "Missing orderId or planId" });
    }

    // 1. Find logged-in user
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Get selected plan
    const selectedPlan = await Plan.findOne({ planId });
    if (!selectedPlan || !selectedPlan.isActive) {
      return res.status(400).json({ success: false, message: "Invalid or inactive plan" });
    }

    // 3. Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // 4. Capture the payment from PayPal
    let captureRes;
    try {
      captureRes = await axios.post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error("PayPal capture failed:", err?.response?.data || err.message);
      return res.status(400).json({ success: false, message: "PayPal capture failed" });
    }

    // 5. Update user plan
    const now = new Date();
    user.isTrialActive = false;
    user.totalCredits = selectedPlan.creditsPerMonth;
    user.currentPlan = {
      planId: selectedPlan.planId,
      status: "active",
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
    await user.save();

    // 6. Log the transaction
    try {
      const transaction = new Transaction({
        userId: user._id,
        orderId,
        planName: selectedPlan.planName,
        credits: selectedPlan.creditsPerMonth,
        amount: selectedPlan.price,
        status: "success",
        createdAt: now,
      });

      await transaction.save();
      console.log("Transaction saved to DB:", transaction);
    } catch (err) {
      console.error("Failed to save transaction:", err.message);
    }

    // 7. Send response
    return res.status(200).json({
      success: true,
      message: "Subscription confirmed and plan activated",
      currentPlan: user.currentPlan,
      transactionId: orderId,
    });

  } catch (err) {
    console.error("Confirm subscription error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm subscription",
    });
  }
};

module.exports = confirmSubscription;
