const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Clear any existing connections
        await mongoose.disconnect();

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Configure mongoose
        mongoose.set('strictQuery', true);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            writeConcern: {
                w: 'majority'
            }
        });

        // Test connection immediately
        await conn.connection.db.admin().ping();
        console.log('MongoDB connection successful - Database responding to ping');
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        console.log('Database Name:', conn.connection.name);

        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected - Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection error details:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        
        // Retry logic for connection errors
        if (error.name === 'MongoServerSelectionError') {
            console.log('Retrying connection in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB();
        }
        
        process.exit(1);
    }
};

module.exports = connectDB; 