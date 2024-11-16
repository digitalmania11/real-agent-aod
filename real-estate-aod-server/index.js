const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");

// Import all routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const reviewRoutes = require("./routes/reviews");
const wishlistRoutes = require("./routes/wishlists");
const offerRoutes = require("./routes/offers");
const paymentRoutes = require("./routes/payments");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", propertyRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", wishlistRoutes);
app.use("/api/v1", offerRoutes);
app.use("/api/v1", paymentRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Real estate Abuild Homes server is running...");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();