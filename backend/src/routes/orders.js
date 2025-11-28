const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const { protect } = require('../middleware/authMiddleware');
const Address = require('../models/Address');

// Get user's orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.item')
            .populate('deliveryAddress')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
            .populate('items.item')
            .populate('deliveryAddress');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Create new order
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, deliveryAddressId, specialInstructions, promoCode } = req.body;

        // Validate address
        const address = await Address.findOne({ _id: deliveryAddressId, user: req.user._id });
        if (!address) {
            return res.status(400).json({ message: 'Invalid delivery address' });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            deliveryAddress: address._id,
            paymentMethod,
            specialInstructions,
            promoCode
        });

        // Populate order details
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.item')
            .populate('deliveryAddress');

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        io.emit('newOrder', populatedOrder);

        res.status(201).json(populatedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
});

// Update order status (admin only)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.id)
            .populate('items.item')
            .populate('deliveryAddress');
            
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.orderStatus = status;
        await order.save();
        
        // Emit socket event for real-time updates
        const io = req.app.get('io');
        io.emit('orderStatusUpdated', order);
        
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status' });
    }
});

// Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
            .populate('items.item')
            .populate('deliveryAddress');
            
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (!['PLACED', 'CONFIRMED'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }
        
        order.orderStatus = 'CANCELLED';
        await order.save();
        
        // Emit socket event for real-time updates
        const io = req.app.get('io');
        io.emit('orderStatusUpdated', order);
        
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error cancelling order' });
    }
});

// Generate order receipt (PDF)
router.get('/:id/receipt', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.item')
            .populate('user', 'username email profile');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this receipt
        if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=order-${order._id}.pdf`);

        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Order Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${order.orderTime.toLocaleString()}`);
        doc.text(`Customer: ${order.user.username}`);
        doc.moveDown();

        // Add items
        doc.text('Items:');
        order.items.forEach(item => {
            doc.text(`${item.item.name} x ${item.quantity} - $${item.price * item.quantity}`);
        });

        doc.moveDown();
        doc.text(`Subtotal: $${order.totalAmount}`);
        if (order.discount > 0) {
            doc.text(`Discount: $${order.discount}`);
        }
        doc.text(`Total: $${order.finalAmount}`, { underline: true });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 