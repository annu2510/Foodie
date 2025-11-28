require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const config = require('./config/config');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: config.frontendURL,
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
    origin: config.frontendURL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/promo', require('./routes/promo'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/user/addresses', require('./routes/userAddressRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Validation Error', 
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(400).json({ 
            message: 'Duplicate key error',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        });
    }
    
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// Start server
server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
}); 

console.log('JWT_SECRET is', process.env.JWT_SECRET);
console.log('MONGODB_URI is', process.env.MONGODB_URI);
console.log('NODE_ENV is', process.env.NODE_ENV);
console.log('FRONTEND_URL is', process.env.FRONTEND_URL);