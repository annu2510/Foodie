const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Validation middleware
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom(async (email) => {
            const exists = await User.emailExists(email);
            if (exists) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'fallback_secret_key_for_development',
        { expiresIn: '7d' }
    );
};

// Register new user
router.post('/register', registerValidation, async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not ready');
        }

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { name, email, password } = req.body;

        // Create user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        // Save user
        const savedUser = await user.save();

        // Generate token
        const token = generateToken(savedUser._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                token,
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message === 'Database connection not ready') {
            return res.status(503).json({
                success: false,
                message: 'Service temporarily unavailable'
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not ready');
        }

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email, password } = req.body;

        // Find user and explicitly select password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'Database connection not ready') {
            return res.status(503).json({
                success: false,
                message: 'Service temporarily unavailable'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information'
        });
    }
});

module.exports = router; 