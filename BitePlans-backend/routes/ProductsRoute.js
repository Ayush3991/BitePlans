const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const checkTrial = require("../middleware/checkTrial");
const deductCredit = require("../middleware/deductCredit");
const {getAllProducts,getSingleProduct,useProduct,} = require("../controllers/ProductController");

// GET /api/v1/products
router.get("/", getAllProducts);
// GET /api/v1/products/:productId
router.get("/:productId", getSingleProduct);
// POST /api/v1/products/:productId/use
router.post("/:productId/use",authenticateUser,checkTrial,deductCredit,useProduct);

module.exports = router;
