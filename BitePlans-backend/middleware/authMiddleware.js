// Import Firebase Admin SDK
const admin = require('../config/firebase');

// Middleware to verify Firebase token and authenticate the user
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is missing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid format' });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the token using Firebase
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Attach decoded user data to request
    req.user = decoded;

    // Move to the next middleware/route
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
module.exports = authenticateUser;
