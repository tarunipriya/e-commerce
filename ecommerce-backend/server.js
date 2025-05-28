require('dotenv').config();
const connectDB = require('./db');
connectDB();
console.log('PORT from .env is:', process.env.PORT);

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Import product routes
const productRoutes = require('../routes/productRoutes');
app.use('/api/products', productRoutes);



// Use product routes
// app.use('/api/products', productRoutes);

// Home route

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
