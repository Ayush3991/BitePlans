const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const admin = require("./config/firebase"); 
const authenticateUser = require("./middleware/authMiddleware"); 
const userRoutes = require("./routes/UsersRoute");
const planRoutes = require("./routes/PlansRoute");
const productRoutes = require("./routes/ProductsRoute");
const creditusageRoutes = require("./routes/CreditusageRoute");
const transactionRoutes = require('./routes/TransactionsRoute');
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json()); 

// Serve static frontend files (from dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Routes mounting
app.use("/api/v1/", userRoutes);         // User-related routes(e.g. /api/v1/register, /api/v1/me)
app.use("/api/v1/plans", planRoutes);   // Plan routes(e.g. /api/v1/plans, api/v1/subscribe)
app.use("/api/v1/products", productRoutes); // Product routes(e.g. /api/v1/products, api/v1/productId/use)
app.use("/api/v1/creditusage", creditusageRoutes); // Credit Usage routes(e.g. /api/v1/creditusage)
app.use("/api/v1/transactions", transactionRoutes); // Product routes(e.g. /api/v1/transactions/Id)

// Catch-all route to handle frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Default Route
app.get("/", (req, res) => {
  res.send("BitePlans Backend is Running");
});

// Protected route (for testing token verification)
app.get("/api/v1/protected", authenticateUser, (req, res) => {
  res.send(`You're authenticated as ${req.user.email || "a valid user"}`);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
