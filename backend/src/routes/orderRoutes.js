const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

        // Create order with initial status
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod
        });

        // Handle payment based on method
        if (paymentMethod === 'CARD') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
                currency: 'inr',
                payment_method_types: ['card'],
                metadata: { orderId: order._id.toString() }
            });

            order.stripePaymentId = paymentIntent.id;
            await order.save();

            res.status(201).json({
                order,
                clientSecret: paymentIntent.client_secret
            });
        } else {
            // For COD, just save the order
            await order.save();
            res.status(201).json({ order });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Get specific order details
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user.id
        }).populate('items.menuItem');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

// Update payment status (webhook endpoint for Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        await Order.findOneAndUpdate(
            { stripePaymentId: paymentIntent.id },
            { paymentStatus: 'COMPLETED' }
        );
    }

    res.json({ received: true });
});

// Cancel order
router.post('/:orderId/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus !== 'PLACED') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.orderStatus = 'CANCELLED';
        await order.save();

        // If payment was made by card, initiate refund
        if (order.paymentMethod === 'CARD' && order.stripePaymentId) {
            const refund = await stripe.refunds.create({
                payment_intent: order.stripePaymentId
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order' });
    }
});

module.exports = router; 