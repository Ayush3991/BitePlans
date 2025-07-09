const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const {getAllCreditUsage} = require("../controllers/CreditUsage");

// Get all active credit usage (public)
router.get("/", authenticateUser, getAllCreditUsage);

module.exports = router;
