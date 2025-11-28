const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const MONGODB_URI = 'mongodb+srv://tsharmak10:Tushar_2002@cluster2.r2podiw.mongodb.net/campus-food?retryWrites=true&w=majority&connectTimeoutMS=30000&socketTimeoutMS=45000';

const testCart = async () => {
    try {
        // Connect to MongoDB Atlas
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB Atlas');

        // Create a test menu item
        const menuItem = new MenuItem({
            name: 'Test Item',
            description: 'Test Description',
            price: 10.99,
            category: 'Snacks',
            image: 'test.jpg',
            preparationTime: 15
        });
        await menuItem.save();
        console.log('Created test menu item:', menuItem._id);

        // Create a test user
        const user = new User({
            name: 'Test User',
            email: 'test' + Date.now() + '@test.com',
            password: 'Test123456',
            role: 'user'
        });
        await user.save();
        console.log('Created test user:', user._id);

        // Test addToCart
        console.log('\nTesting addToCart...');
        await user.addToCart(menuItem._id, 2);
        let updatedUser = await User.findById(user._id);
        console.log('Cart after adding item:', updatedUser.cart);

        // Test updateCartItemQuantity
        console.log('\nTesting updateCartItemQuantity...');
        await user.updateCartItemQuantity(menuItem._id, 3);
        updatedUser = await User.findById(user._id);
        console.log('Cart after updating quantity:', updatedUser.cart);

        // Test getCart with population
        console.log('\nTesting getCart...');
        const populatedCart = await user.getCart();
        console.log('Populated cart:', JSON.stringify(populatedCart, null, 2));

        // Test getCartTotal
        console.log('\nTesting getCartTotal...');
        const total = await user.getCartTotal();
        console.log('Cart total:', total);

        // Test removeFromCart
        console.log('\nTesting removeFromCart...');
        await user.removeFromCart(menuItem._id);
        updatedUser = await User.findById(user._id);
        console.log('Cart after removing item:', updatedUser.cart);

        // Clean up
        await MenuItem.findByIdAndDelete(menuItem._id);
        await User.findByIdAndDelete(user._id);
        console.log('\nTest completed successfully');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the test
testCart(); 