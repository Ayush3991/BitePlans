const Plan = require("../models/Plan");
const User = require('../models/User');
const axios = require("axios");
const { getPayPalAccessToken } = require("../config/paypal");

// GET /api/v1/plans - Fetch all available plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });

    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No plans found",
      });
    }

    // Format plans for frontend
    const formattedPlans = plans.map((plan) => ({
      name: plan.planName,
      planId: plan.planId,
      price: plan.price,
      period: plan.period, 
      credits:
        plan.creditsPerMonth === -1 ? "Unlimited" : plan.creditsPerMonth,
      features: Array.isArray(plan.features) ? plan.features : [],
      buttonText:
        plan.creditsPerMonth === -1
          ? "Choose Enterprise"
          : `Choose ${plan.planName}`,
      paypalPlanId: plan.paypalPlanId,
    }));

    return res.status(200).json({
      success: true,
      data: formattedPlans,
    });
  } catch (error) {
    console.error("Failed to fetch plans:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching plans",
    });
  }
};

// POST /api/v1/plans/subscribe - Create PayPal subscription order
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const selectedPlan = await Plan.findOne({ planId });
    if (!selectedPlan || !selectedPlan.isActive) {
      return res.status(400).json({ success: false, message: "Invalid or inactive plan" });
    }

    const accessToken = await getPayPalAccessToken();

    const orderResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: selectedPlan.price.toString(),
            },
            description: `BitePlans - ${selectedPlan.planName} Plan`,
          },
        ],
        application_context: {
          return_url: `http://localhost:5173/payment-success?planId=${selectedPlan.planId}`, // ✅ Add planId here only
          cancel_url: "http://localhost:5173/pricing",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalLink = orderResponse.data.links.find((link) => link.rel === "approve")?.href;
    if (!approvalLink) return res.status(500).json({ success: false, message: "No approval link" });

    return res.status(200).json({
      success: true,
      orderId: orderResponse.data.id,
      approvalUrl: approvalLink,
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ success: false, message: "Subscription error" });
  }
};

module.exports = {getAllPlans,subscribeToPlan};
