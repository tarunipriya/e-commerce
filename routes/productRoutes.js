const express = require('express');
const router = express.Router();

const products = {
  women: {
    ethnicwear: [
      { id: 1, name: "Women's Saree", price: 49.99 },
      { id: 2, name: "Women's Salwar Kameez", price: 59.99 }
    ],
    tops: [
      { id: 3, name: "Women's Top", price: 19.99 }
    ]
  },
  men: {
    shirts: [
      { id: 4, name: "Men's Shirt", price: 25.99 }
    ]
  }
};

// Route: /api/products/:category/:subcategory
router.get('/:category/:subcategory', (req, res) => {
  console.log('Request params:', req.params);
  const category = req.params.category.toLowerCase();
  const subcategory = req.params.subcategory.toLowerCase();

  if (!products[category]) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const subProducts = products[category][subcategory];
  if (!subProducts) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  res.json(subProducts);
});

module.exports = router;
