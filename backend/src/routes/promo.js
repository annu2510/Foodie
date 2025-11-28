const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');

// Get all active promo codes
router.get('/', async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({ isActive: true });
        res.json(promoCodes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new promo code (admin only)
router.post('/', [
    auth,
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('discountType').isIn(['Percentage', 'Fixed']).withMessage('Invalid discount type'),
    body('discountValue').isNumeric().withMessage('Discount value must be a number'),
    body('minOrderAmount').optional().isNumeric().withMessage('Minimum order amount must be a number'),
    body('maxDiscount').optional().isNumeric().withMessage('Maximum discount must be a number'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive number')
], async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const promoCode = new PromoCode({
            ...req.body,
            createdBy: req.user.userId
        });

        await promoCode.save();
        res.status(201).json(promoCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Validate promo code
router.post('/validate', [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('orderAmount').isNumeric().withMessage('Order amount must be a number')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, orderAmount } = req.body;

        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        if (!promoCode.isValid()) {
            return res.status(400).json({ message: 'Promo code is not valid' });
        }

        if (orderAmount < promoCode.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount of $${promoCode.minOrderAmount} required` 
            });
        }

        let discount = 0;
        if (promoCode.discountType === 'Percentage') {
            discount = (orderAmount * promoCode.discountValue) / 100;
            if (promoCode.maxDiscount) {
                discount = Math.min(discount, promoCode.maxDiscount);
            }
        } else {
            discount = promoCode.discountValue;
        }

        res.json({
            promoCode: {
                id: promoCode._id,
                code: promoCode.code,
                description: promoCode.description,
                discountType: promoCode.discountType,
                discountValue: promoCode.discountValue,
                discount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update promo code (admin only)
router.put('/:id', [
    auth,
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive number')
], async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const promoCode = await PromoCode.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        res.json(promoCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete promo code (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        res.json({ message: 'Promo code deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 