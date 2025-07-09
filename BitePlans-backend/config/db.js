const mongoose = require("mongoose");

// Function to connect MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Connection using MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log connection host on success
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and stop server
    console.error("MongoDB connection error:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
