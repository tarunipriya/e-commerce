const mongoose = require('mongoose');
require('dotenv').config();

console.log('MONGO_URI from .env:', process.env.MONGO_URI);  // Debug your URI

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
