const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new menu item (admin only)
router.post('/', [
    auth,
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages']).withMessage('Invalid category'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('preparationTime').isNumeric().withMessage('Preparation time must be a number')
], async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update menu item (admin only)
router.put('/:id', [
    auth,
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('category').optional().isIn(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages']).withMessage('Invalid category'),
    body('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty'),
    body('preparationTime').optional().isNumeric().withMessage('Preparation time must be a number')
], async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete menu item (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add rating and review
router.post('/:id/rate', [
    auth,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Check if user has already rated
        const existingRating = menuItem.ratings.find(
            r => r.user.toString() === req.user.userId
        );

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this item' });
        }

        menuItem.ratings.push({
            user: req.user.userId,
            rating: req.body.rating,
            review: req.body.review
        });

        await menuItem.save();
        res.json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 