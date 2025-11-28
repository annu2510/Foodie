const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number
    },
    usedCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if promo code is valid
promoCodeSchema.methods.isValid = function() {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (!this.usageLimit || this.usedCount < this.usageLimit)
    );
};

module.exports = mongoose.model('PromoCode', promoCodeSchema); 