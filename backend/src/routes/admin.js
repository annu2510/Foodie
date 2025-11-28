const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
};

// Get dashboard stats
router.get('/dashboard', [auth, isAdmin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]);

        const topItems = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { 
                _id: '$items.item',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: 'menuitems',
                localField: '_id',
                foreignField: '_id',
                as: 'itemDetails'
            }},
            { $unwind: '$itemDetails' }
        ]);

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            topItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', [auth, isAdmin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user role
router.put('/users/:id/role', [
    auth,
    isAdmin,
    body('role').isIn(['student', 'faculty', 'admin', 'kitchen']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders
router.get('/orders', [auth, isAdmin], async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('items.item')
            .sort({ orderTime: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export orders to CSV
router.get('/orders/export', [auth, isAdmin], async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('items.item');

        const csvData = orders.map(order => ({
            OrderID: order._id,
            Customer: order.user.username,
            Email: order.user.email,
            Items: order.items.map(item => `${item.item.name} x ${item.quantity}`).join(', '),
            TotalAmount: order.totalAmount,
            Discount: order.discount,
            FinalAmount: order.finalAmount,
            Status: order.status,
            OrderTime: order.orderTime,
            DeliveryTime: order.actualDeliveryTime
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');

        // Convert to CSV
        const csv = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get audit logs (track admin actions)
router.get('/audit-logs', [auth, isAdmin], async (req, res) => {
    try {
        // This is a placeholder. In a real application, you would have an AuditLog model
        // and track all admin actions in the database
        res.json({ message: 'Audit logs feature coming soon' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 