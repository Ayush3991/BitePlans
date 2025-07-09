const User = require("../models/User");

const checkTrial = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const today = new Date();

    if (user.isTrialActive && today > user.trialEndDate) {
      // Trial expired, deactivate trial
      user.isTrialActive = false;
      await user.save();
    }

    next(); // Continue to controller
  } catch (error) {
    console.error("Trial check error:", error);
    return res.status(500).json({ success: false, message: "Server error during trial check" });
  }
};

module.exports = checkTrial;
