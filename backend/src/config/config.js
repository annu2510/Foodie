require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb+srv://tsharmak10:Tushar_2002@cluster2.r2podiw.mongodb.net/campus-food?retryWrites=true&w=majority&connectTimeoutMS=30000&socketTimeoutMS=45000',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    frontendURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development'
}; 