const Product = require("../models/Product");
const User = require("../models/User");
const CreditUsage = require("../models/CreditUsage");

// GET /api/v1/products - Fetch all available products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // If no products found
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products available",
      });
    }

    // Send product list
    return res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting products",
    });
  }
};

// GET /api/v1/products/:productId - Get single product by productId
const getSingleProduct = async (req, res) => {
  try {
    // Fetch product Id by URL
    const { productId } = req.params;

    // Search product by product Id
    const product = await Product.findOne({ productId });

    // If product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Return product data
    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    // Error handling
    console.error("Failed to fetch product:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting the product",
    });
  }
};

// POST /api/v1/products/:productId/use - Use product and deduct credits
const useProduct = async (req, res) => {
  try {
    // Get already fetched user & product from middleware
    const user = req.userDetails;
    const product = req.productDetails;
      
    // Create new credit usage entry in db
    const usage = new CreditUsage({
      userId: user._id,
      productId: product.productId,
      productName: product.name,
      creditsUsed: product.creditCost,
      status: "success",
      timestamp: new Date(),
    });
    await usage.save(); // Save to DB

    return res.status(200).json({
      success: true,
      message: `${product.name} used successfully.`,
      remainingCredits: user.totalCredits,
    });
  } catch (error) {
    console.error("Error using product:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while using the product",
    });
  }
};

module.exports = {getAllProducts,getSingleProduct,useProduct,};
