const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const { getAllPlans, subscribeToPlan } = require("../controllers/PlanController");
const confirmSubscription = require("../controllers/ConfirmSubscription");
// Get all active plans 
router.get("/", getAllPlans);

//  Subscribe to update plan 
router.post("/subscribe", authenticateUser, subscribeToPlan);

// POST /api/v1/plans/confirm-subscription
router.post("/confirm-subscription", authenticateUser, confirmSubscription);

module.exports = router;
