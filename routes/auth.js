const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Route สำหรับสมัครสมาชิก
router.post('/signup', async (req, res) => {
  console.log('POST /signup called');
  const { name, email, password } = req.body;

  try {
    // ตรวจสอบว่าอีเมลมีอยู่หรือไม่
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้างผู้ใช้ใหม่
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // สร้าง JWT Token
    const token = jwt.sign({ id: user.id }, 'adminpass', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error in /signup:', err.message);
    res.status(500).send('Server error');
  }
});

// Route สำหรับเข้าสู่ระบบ
router.post('/login', async (req, res) => {
  console.log('POST /login called');
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error in /login:', err.message);
    res.status(500).send('Server error');
  }
});

// Route ที่ต้องตรวจสอบตัวตน
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error in /profile:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
