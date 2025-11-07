import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";

// === MODELS ===
import User from "./models/User.js";

// === ROUTES ===
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import clickRoutes from "./routes/clicks.js"; // <-- Click tracking (view history + analytics)

dotenv.config();

const app = express();

/* ==========================
   🔧 MIDDLEWARE
========================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================
   🌐 API ROUTES
========================== */
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clicks", clickRoutes); // <-- Register click tracking routes

/* ==========================
   💾 DATABASE CONNECTION
========================== */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // === Ensure Admin Account Exists & Password Fixed ===
    const adminEmail = "admin@example.com";
    const admin = await User.findOne({ email: adminEmail });

    if (admin) {
      const hashed = await bcrypt.hash("Admin1234", 10);
      await User.updateOne({ _id: admin._id }, { $set: { password: hashed } });
      console.log("✅ Admin password fixed correctly");
    } else {
      const hashed = await bcrypt.hash("Admin1234", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });
      console.log("✅ Default admin account created");
    }

    /* ==========================
       🚀 START SERVER
    ========================== */
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    process.exit(1);
  }
};

startServer();
