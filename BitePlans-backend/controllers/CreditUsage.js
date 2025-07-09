const CreditUsage = require("../models/CreditUsage");
const User = require("../models/User");

const getAllCreditUsage = async (req, res) => {
  try {
    const firebaseUID = req.user.uid;

    // Get MongoDB user ID from Firebase UID
    const user = await User.findOne({ firebaseUid: firebaseUID });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in DB",
      });
    }

    const creditusage = await CreditUsage.find({ userId: user._id }).sort({ timestamp: -1 });

    if (!creditusage || creditusage.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No credit usage available",
      });
    }

    return res.json({
      success: true,
      data: creditusage,
    });
  } catch (error) {
    console.error("Failed to fetch creditusage:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting credit usage",
    });
  }
};

module.exports = { getAllCreditUsage };
