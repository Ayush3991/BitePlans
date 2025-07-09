const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware"); // Middleware to protect routes using Firebase token
const multer = require('multer');
// Controller functions
const {getUserProfile,registerUser,updateUserProfile} = require("../controllers/UserController");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/v1/me- Get current logged-in user profile
router.get("/me", authenticateUser, getUserProfile);

// POST /api/v1/register- Register new user after Firebase signup
router.post("/register", authenticateUser, registerUser);

// PUT /api/v1/update- Update user data
router.put('/update', authenticateUser,upload.single('profilePic'),updateUserProfile);

module.exports = router;
