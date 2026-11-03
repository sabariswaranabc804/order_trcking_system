const express = require('express');
const router = express.Router();
const CartController = require('../controllers/user/cartController');
const authMiddleware = require('../middleware/auth');

// All cart routes require authentication
router.use(authMiddleware);

// Get cart items
router.get('/', CartController.getCartItems);

// Get cart count
router.get('/count', CartController.getCartCount);

// Add item to cart
router.post('/add', CartController.addToCart);

// Remove item from cart
router.delete('/remove/:servSubTypeId', CartController.removeFromCart);

// Update item quantity
router.put('/update/:servSubTypeId', CartController.updateQuantity);

// Increase quantity
router.put('/increase/:servSubTypeId', CartController.increaseQuantity);

// Decrease quantity
router.put('/decrease/:servSubTypeId', CartController.decreaseQuantity);

// Clear entire cart
router.delete('/clear', CartController.clearCart);

module.exports = router;