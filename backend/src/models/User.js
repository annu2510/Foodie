const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password by default in queries
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'kitchen'],
            message: '{VALUE} is not a valid role'
        },
        default: 'user'
    },
    profileImage: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    cart: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// Create indexes
userSchema.index({ email: 1 });

// Cart Methods
userSchema.methods.addToCart = async function(menuItemId, quantity = 1) {
    try {
        // Find existing cart item
        const existingItemIndex = this.cart.findIndex(item => 
            item.item.toString() === menuItemId.toString()
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.cart.push({ item: menuItemId, quantity });
        }

        // Mark cart as modified
        this.markModified('cart');
        
        // Save to MongoDB
        const savedUser = await this.save();
        return savedUser.cart;
    } catch (error) {
        console.error('Error in addToCart:', error);
        throw new Error('Error adding item to cart: ' + error.message);
    }
};

userSchema.methods.removeFromCart = async function(menuItemId) {
    try {
        // Filter out the item
        this.cart = this.cart.filter(item => 
            item.item.toString() !== menuItemId.toString()
        );

        // Mark cart as modified
        this.markModified('cart');
        
        // Save to MongoDB
        const savedUser = await this.save();
        return savedUser.cart;
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        throw new Error('Error removing item from cart: ' + error.message);
    }
};

userSchema.methods.updateCartItemQuantity = async function(menuItemId, quantity) {
    try {
        const cartItem = this.cart.find(item => 
            item.item.toString() === menuItemId.toString()
        );

        if (!cartItem) {
            throw new Error('Item not found in cart');
        }

        if (quantity <= 0) {
            return await this.removeFromCart(menuItemId);
        }

        cartItem.quantity = quantity;
        
        // Mark cart as modified
        this.markModified('cart');
        
        // Save to MongoDB
        const savedUser = await this.save();
        return savedUser.cart;
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        throw new Error('Error updating cart item quantity: ' + error.message);
    }
};

userSchema.methods.clearCart = async function() {
    try {
        this.cart = [];
        
        // Mark cart as modified
        this.markModified('cart');
        
        // Save to MongoDB
        const savedUser = await this.save();
        return savedUser.cart;
    } catch (error) {
        console.error('Error in clearCart:', error);
        throw new Error('Error clearing cart: ' + error.message);
    }
};

userSchema.methods.getCart = async function() {
    try {
        await this.populate('cart.item');
        return this.cart;
    } catch (error) {
        console.error('Error in getCart:', error);
        throw new Error('Error getting cart: ' + error.message);
    }
};

userSchema.methods.getCartTotal = async function() {
    try {
        await this.populate('cart.item');
        return this.cart.reduce((total, cartItem) => {
            return total + (cartItem.item.price * cartItem.quantity);
        }, 0);
    } catch (error) {
        console.error('Error in getCartTotal:', error);
        throw new Error('Error calculating cart total: ' + error.message);
    }
};

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.__v;
    return user;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        // Generate salt
        const salt = await bcrypt.genSalt(12);
        // Hash password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Need to explicitly select password as it's excluded by default
        const user = await this.constructor.findById(this._id).select('+password');
        if (!user) {
            throw new Error('User not found');
        }
        return await bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Static method to check if email exists
userSchema.statics.emailExists = async function(email) {
    return await this.findOne({ email: email.toLowerCase() });
};

// Handle duplicate key errors
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 