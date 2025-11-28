const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'CARD'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    orderStatus: {
        type: String,
        enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'PLACED'
    },
    stripePaymentId: String,
    specialInstructions: String,
    promoCode: String,
    discount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate final amount before saving
orderSchema.pre('save', function(next) {
    if (this.isModified('totalAmount') || this.isModified('discount')) {
        this.finalAmount = this.totalAmount - (this.discount || 0);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema); 