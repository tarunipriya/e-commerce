const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: String, // URL or filename
    default: ''
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
