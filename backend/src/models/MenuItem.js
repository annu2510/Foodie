const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate average rating before saving
menuItemSchema.pre('save', function(next) {
    if (this.ratings.length > 0) {
        this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
    }
    next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 