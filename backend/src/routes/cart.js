const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

// Middleware to check MongoDB connection
const checkDbConnection = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database connection is not ready'
        });
    }
    next();
};

// Get cart
router.get('/', [auth, checkDbConnection], async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const cart = await user.getCart();
        const total = await user.getCartTotal();

        console.log('Cart retrieved for user:', user._id, 'Cart items:', cart.length);

        res.json({
            success: true,
            data: { cart, total }
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add item to cart
router.post('/add', [auth, checkDbConnection], async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;

        // Validate menu item exists
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.addToCart(menuItemId, quantity);
        console.log('Item added to cart for user:', user._id, 'Item:', menuItemId, 'Quantity:', quantity);
        
        const cart = await user.getCart();
        const total = await user.getCartTotal();

        // Verify the cart was updated
        const updatedUser = await User.findById(req.user.userId);
        console.log('Updated cart items count:', updatedUser.cart.length);

        res.json({
            success: true,
            data: { cart, total }
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update cart item quantity
router.put('/update/:menuItemId', [auth, checkDbConnection], async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const { quantity } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.updateCartItemQuantity(menuItemId, quantity);
        console.log('Cart item updated for user:', user._id, 'Item:', menuItemId, 'New quantity:', quantity);

        const cart = await user.getCart();
        const total = await user.getCartTotal();

        res.json({
            success: true,
            data: { cart, total }
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Remove item from cart
router.delete('/remove/:menuItemId', [auth, checkDbConnection], async (req, res) => {
    try {
        const { menuItemId } = req.params;
        
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.removeFromCart(menuItemId);
        console.log('Item removed from cart for user:', user._id, 'Item:', menuItemId);

        const cart = await user.getCart();
        const total = await user.getCartTotal();

        res.json({
            success: true,
            data: { cart, total }
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Clear cart
router.delete('/clear', [auth, checkDbConnection], async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.clearCart();
        console.log('Cart cleared for user:', user._id);

        res.json({
            success: true,
            data: { cart: [], total: 0 }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 