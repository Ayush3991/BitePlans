const User = require("../models/User");
const Product = require("../models/Product");

const deductCredits = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Find the logged-in user from DB
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the requested product from DB
    const product = await Product.findOne({ productId });
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not available" });
    }

    // Check if user has enough credits
    if (user.totalCredits < product.creditCost) {
      return res.status(403).json({ success: false, message: "Not enough credits" });
    }

    // Deduct credits and update user's usedCredits
    user.totalCredits -= product.creditCost;
    user.usedCredits += product.creditCost;
    await user.save();

    // Attach updated user & product to request for use in controller
    req.userDetails = user;
    req.productDetails = product;

    // Go to controller
    next();
  } catch (error) {
    console.error("Credit deduction error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during credit deduction" });
  }
};

module.exports = deductCredits;
