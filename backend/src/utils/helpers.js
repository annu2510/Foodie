const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        config.jwtSecret,
        { expiresIn: '24h' }
    );
};

// Format date to ISO string
const formatDate = (date) => {
    return new Date(date).toISOString();
};

// Calculate total amount for order
const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Apply discount to order
const applyDiscount = (totalAmount, promoCode) => {
    if (!promoCode) return { totalAmount, discount: 0 };

    let discount = 0;
    if (promoCode.discountType === 'Percentage') {
        discount = (totalAmount * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount) {
            discount = Math.min(discount, promoCode.maxDiscount);
        }
    } else {
        discount = promoCode.discountValue;
    }

    return {
        totalAmount,
        discount,
        finalAmount: totalAmount - discount
    };
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

module.exports = {
    generateToken,
    formatDate,
    calculateTotalAmount,
    applyDiscount,
    isValidEmail,
    isStrongPassword
}; 