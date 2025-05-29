<<<<<<< HEAD
// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const connectDB = require('./db');

// Initialize express app
const app = express();

// Use environment PORT or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Middleware to parse JSON bodies
    app.use(express.json());

    // User authentication routes
    const userRoutes = require('./routes/users');
    app.use('/api/users', userRoutes);

    // Product routes (optional - ensure the file exists)
    try {
      const productRoutes = require('./routes/productRoutes');
      app.use('/api/products', productRoutes);
    } catch (err) {
      console.warn('⚠️ No productRoutes found. Skipping...');
    }

    // Test route to confirm server is working
    app.get('/', (req, res) => {
      res.send('🚀 API is running!');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer();
=======
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Import product routes
const productRoutes = require('./routes/productRoutes');

// Use product routes
app.use('/api/products', productRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
>>>>>>> e24435ed9c7d5d4281665a55e4003cc156b8d010
