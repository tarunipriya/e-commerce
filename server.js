require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./db');

// Import models
const User = require('./models/User');

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import shared auth middleware
const authMiddleware = require('./middleware/authMiddleware');

// ✅ Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ Invalid JSON:', err.message);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }
  next();
});

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);

// ✅ Protected route
app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Ensure env vars exist
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing MONGO_URI or JWT_SECRET in environment');
  process.exit(1);
}

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
