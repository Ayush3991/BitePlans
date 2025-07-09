const Transaction = require("../models/Transaction");
const User = require("../models/User");

const getAllTransactions = async (req, res) => {
  try {
    const firebaseUID = req.user.uid;
    const user = await User.findOne({ firebaseUid: firebaseUID });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in DB" });
    }

    const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).json({ success: false, message: "No transactions found for this user" });
    }

    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Failed to fetch transactions:", error.message);
    return res.status(500).json({ success: false, message: "Server error while getting transactions" });
  }
};

module.exports = { getAllTransactions };
