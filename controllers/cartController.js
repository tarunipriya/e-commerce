const Cart = require('../models/cart');

// Add or update item in cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    console.log('✅ [getCart] req.user:', req.user);
    const userId = req.user.id || req.user.userId; 
    console.log('✅ [getCart] userId:', userId);   

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      console.log('⚠️ [getCart] Cart not found');
      return res.status(200).json({ items: [], total: 0 });
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.status(200).json({
      items: cart.items.map(item => ({
        product_id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      total
    });
  } catch (err) {
    console.error('❌ [getCart] Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Clear current user's cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
