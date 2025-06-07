const express = require('express');
const router = express.Router();
const Product = require('../models/product');

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET all products (public)
router.get('/', getAllProducts);

// ✅ POST a new product (protected)
router.post('/', authMiddleware, createProduct);

// ✅ GET a product by ID (public)
router.get('/:id', getProductById);

// ✅ PUT (update) a product by ID (protected)
router.put('/:id', authMiddleware, updateProduct);

// ✅ DELETE a product by ID (protected)
router.delete('/:id', authMiddleware, deleteProduct);

// 🧪 Mock route: GET products by category and subcategory
router.get('/:category/:subcategory', (req, res) => {
  const products = {
    women: {
      ethnicwear: [
        { id: 1, name: "Women's Saree", price: 49.99 },
        { id: 2, name: "Women's Salwar Kameez", price: 59.99 }
      ],
      tops: [{ id: 3, name: "Women's Top", price: 19.99 }]
    },
    men: {
      shirts: [{ id: 4, name: "Men's Shirt", price: 25.99 }]
    }
  };

  const category = req.params.category.toLowerCase();
  const subcategory = req.params.subcategory.toLowerCase();

  if (products[category] && products[category][subcategory]) {
    res.json(products[category][subcategory]);
  } else {
    res.status(404).json({ message: 'No products found for this category/subcategory.' });
  }
});

module.exports = router;
