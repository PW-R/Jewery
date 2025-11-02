import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Routes
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';

// DB connection
import connectDB from './config/db.js';
import User from './models/User.js'; // import model User

dotenv.config();

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // parse JSON bodies

// === ROUTES ===
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// === CONNECT TO MONGODB ===
connectDB().then(async () => {
  console.log('MongoDB connected');

  // === CREATE ADMIN ACCOUNT IF NOT EXISTS ===
const fixAdminPassword = async () => {
  const admin = await User.findOne({ email: "admin@example.com" });
  if (admin) {
    // ใช้ updateOne แทน save() เพื่อ bypass pre-save hook
    const hashed = await bcrypt.hash('Admin1234', 10);
    await User.updateOne({ _id: admin._id }, { $set: { password: hashed } });
    console.log("✅ Admin password fixed correctly");
  }
};

  await fixAdminPassword(); // <-- await
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
