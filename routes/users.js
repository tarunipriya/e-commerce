const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure you have this middleware implemented as explained

// Simple email validation helper
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// POST /api/users/register
router.post('/register', async (req, res) => {
  console.log('Register request body:', req.body); // Debug log

  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
   console.log('Login request body:', req.body); // Log incoming data
  // console.log('Login request body:', req.body); // Debug log

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('User found in DB:', user);  // Log user or null

    if (!user) {
      console.log('No user found with this email');  // No user case
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch); // true/false

    if (!isMatch) {
      console.log('Password did not match');  // Password wrong case
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not set in .env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/profile - protected route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Profile Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
