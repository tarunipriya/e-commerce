const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// POST /api/users/register
router.post('/register', async (req, res) => {
  console.log('Register route called');  // Log when route is hit
  const { name, email, password } = req.body;
  console.log('Received:', { name, email, password });  // Log input data

  if (!name || !email || !password) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    console.log('User found:', user);

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User saved:', user);

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
