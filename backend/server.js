import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// === ROUTES ===
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import clickRoutes from "./routes/clicks.js"; // <-- Click tracking routes

// === DATABASE CONNECTION ===
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// === ROUTES ===
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clicks", clickRoutes); // <-- Register click tracking routes

// === CONNECT TO MONGODB ===
connectDB().then(async () => {
  console.log("✅ MongoDB connected");

  // === CREATE OR FIX ADMIN ACCOUNT ===
  const fixAdminPassword = async () => {
    const admin = await User.findOne({ email: "admin@example.com" });
    if (admin) {
      // Hash and update password if needed
      const hashed = await bcrypt.hash("Admin1234", 10);
      await User.updateOne({ _id: admin._id }, { $set: { password: hashed } });
      console.log("✅ Admin password fixed correctly");
    }
  };

  await fixAdminPassword();
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
