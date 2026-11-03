const CartModel = require('../../models/user/cartModel');

class CartController {
    // Get cart items
    static async getCartItems(req, res) {
        try {
            const userId = req.user.id; // Using the decrypted user ID from JWT
            console.log("userid", userId);

            const cartItems = await CartModel.getCartItems(userId);

            res.status(200).json({
                success: true,
                data: cartItems,
                message: 'Cart items retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getCartItems:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cart items',
                error: error.message
            });
        }
    }

    // Add item to cart
    static async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const item = req.body;
            console.log("item",item);
            
            // Validate required fields
            if (!item.servSubType_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Service subtype ID is required'
                });
            }

            const result = await CartModel.addToCart(userId, item);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in addToCart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to add item to cart',
                error: error.message
            });
        }
    }

    // Remove item from cart
    static async removeFromCart(req, res) {
        try {
            const userId = req.user.id;
            const { servSubTypeId } = req.params;

            const result = await CartModel.removeFromCart(userId, parseInt(servSubTypeId));

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in removeFromCart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove item from cart',
                error: error.message
            });
        }
    }

    // Update item quantity
    static async updateQuantity(req, res) {
        try {
            const userId = req.user.id;
            const { servSubTypeId } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required'
                });
            }

            const result = await CartModel.updateQuantity(userId, parseInt(servSubTypeId), quantity);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in updateQuantity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update quantity',
                error: error.message
            });
        }
    }

    // Increase quantity
    static async increaseQuantity(req, res) {
        try {
            const userId = req.user.id;
            const { servSubTypeId } = req.params;

            // Get current quantity first
            const cartItems = await CartModel.getCartItems(userId);
            console.log("cart",cartItems);
            
            const currentItem = cartItems.find(item => item.servSubType_Id == servSubTypeId);

            if (!currentItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            const newQuantity = currentItem.quantity + 1;
            const result = await CartModel.updateQuantity(userId, parseInt(servSubTypeId), newQuantity);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in increaseQuantity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to increase quantity',
                error: error.message
            });
        }
    }

    // Decrease quantity
    static async decreaseQuantity(req, res) {
        try {
            const userId = req.user.id;
            const { servSubTypeId } = req.params;

            // Get current quantity first
            const cartItems = await CartModel.getCartItems(userId);
              console.log("cart",cartItems);
            const currentItem = cartItems.find(item => item.servSubType_Id == servSubTypeId);

            if (!currentItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found in cart'
                });
            }

            const newQuantity = Math.max(1, currentItem.quantity - 1); // Don't go below 1
            const result = await CartModel.updateQuantity(userId, parseInt(servSubTypeId), newQuantity);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in decreaseQuantity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to decrease quantity',
                error: error.message
            });
        }
    }

    // Clear cart
    static async clearCart(req, res) {
        try {
            const userId = req.user.id;
            const result = await CartModel.clearCart(userId);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in clearCart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to clear cart',
                error: error.message
            });
        }
    }

    // Get cart count
    static async getCartCount(req, res) {
        try {
            const userId = req.user.id;
            const count = await CartModel.getCartCount(userId);

            res.status(200).json({
                success: true,
                data: { count },
                message: 'Cart count retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getCartCount:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get cart count',
                error: error.message
            });
        }
    }
}

module.exports = CartController;