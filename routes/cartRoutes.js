const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have this

console.log("➡️ cartController.addToCart:", typeof cartController.addToCart);
console.log("➡️ authMiddleware:", typeof authMiddleware);


// Add item to cart (protected)
router.post('/add', authMiddleware, cartController.addToCart);

// Get cart by userId (protected)

router.get('/', authMiddleware, cartController.getCart);


// Clear cart by userId (protected)
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
