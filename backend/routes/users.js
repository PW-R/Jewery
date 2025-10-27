import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinaryConfig from '../config/cloudinary.js';
import multer from 'multer';

const upload = multer({ storage: cloudinaryConfig.storage });
const router = express.Router();

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  try {
    const { title, firstName, lastName, age, email, password, phone } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่ (ใช้ email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      title,
      firstName,
      lastName,
      age,
      email,
      password, // จะถูกเข้ารหัสอัตโนมัติโดย pre-save hook
      phone
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบผู้ใช้
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // สร้าง JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        age: user.age
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

//update user
router.put('/update/:id', async (req, res) => {
  
});

//delete user
router.delete('/delete/:id', async (req, res) => {

  })


export default router;

