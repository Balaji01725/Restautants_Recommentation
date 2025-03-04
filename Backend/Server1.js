const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const restaurantRouter = require("./routes/users1");

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/restaurantdb")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use the Restaurant Router
app.use("/api/restaurants", restaurantRouter);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("⚠️ Unhandled Error:", err);
  if (!res.headersSent) res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
