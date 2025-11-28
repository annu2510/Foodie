const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword, profileImage } = req.body;
        const user = await User.findById(req.user.userId).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (profileImage) user.profileImage = profileImage;

        // Update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 