import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
;

// DB connection
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // parse JSON bodies

// === ROUTES ===
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/clicks', clicksRoutes);

// === CONNECT TO MONGODB ===
connectDB();

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
