const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Place a new order (protected)
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { items, totalAmount, address } = req.body;

  try {
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      address
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

// ✅ Get all orders for logged-in user (protected)
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;
