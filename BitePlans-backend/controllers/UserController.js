const User = require("../models/User");

// GET /api/v1/me- Get profile of the currently logged-in user
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    // If user is not found in DB
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    // Return user info
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error while fetching user:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting profile",
    });
  }
};

// POST /api/v1/register- Register a new user after Firebase login
 const registerUser = async (req, res) => {
  try {
    console.log("Firebase UID:", req.user?.uid);
    console.log("Request Body:", req.body);
    const { email, name } = req.body;
    const firebaseUid = req.user.uid;

    // Check if user already exists
    const userExists = await User.findOne({ firebaseUid });
    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    // Set trial period (7 days from today)
    const trialDuration = 7 * 24 * 60 * 60 * 1000;
    const trialEnds = new Date(Date.now() + trialDuration);

    // Create user object
    const newUser = new User({
      firebaseUid,
      email,
      displayName: name,
      totalCredits: 100, // Assign trial on signup
      trialStartDate: new Date(),
      trialEndDate: trialEnds,
      isTrialActive: true,
      currentPlan: {
        planId: "trial",
        status: "active",
        startDate: new Date(),
        endDate: trialEnds,
      },
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering user",
    });
  }
};

// PUT /api/v1/update - Update user profile info
const updateUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Name update 
    if (req.body.name) {
      user.displayName = req.body.name;
    }

    // Profile Pic
    if (req.file) {
      const buffer = req.file.buffer;
      const base64Image = buffer.toString("base64");
      const mimeType = req.file.mimetype;
      user.profileImage = `data:${mimeType};base64,${base64Image}`;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {getUserProfile,registerUser,updateUserProfile};
