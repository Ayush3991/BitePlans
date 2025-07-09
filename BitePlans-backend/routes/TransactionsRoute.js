const express = require('express');
const router = express.Router();
const { getAllTransactions } = require('../controllers/TransactionController');
const authenticateUser = require("../middleware/authMiddleware");

// GET single transaction by PayPal orderId
router.get("/", authenticateUser, getAllTransactions);

module.exports = router;
