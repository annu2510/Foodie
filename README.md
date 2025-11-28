# Campus Food Ordering System

A full-stack web application for ordering food on campus, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### User Features (Student/Faculty)
- User registration and login with role-based access
- Browse menu items by category
- Add items to cart and modify quantity
- Place orders with summary view
- Track order status in real-time
- View order history and reorder previous items
- Rate and review items
- Apply promo codes for discounts
- Download order receipts (PDF)
- Toggle between Dark/Light mode
- Responsive PWA UI for mobile/desktop

### Admin Panel
- Secure admin login
- Add, edit, or delete menu items
- Manage all orders: view, filter, change status
- Add or remove promo codes
- View dashboard with sales statistics
- Export data to CSV
- Manage stock and food availability
- View audit logs

### Kitchen Staff Panel
- View pending/preparing orders
- Mark orders as ready for pickup

## Tech Stack

### Frontend
- React.js with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Socket.io for real-time updates
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time updates
- PDFKit for receipt generation

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus_food
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Menu
- GET /api/menu - Get all menu items
- GET /api/menu/:id - Get menu item by ID
- POST /api/menu - Create new menu item (admin only)
- PUT /api/menu/:id - Update menu item (admin only)
- DELETE /api/menu/:id - Delete menu item (admin only)
- POST /api/menu/:id/rate - Rate a menu item

### Orders
- GET /api/orders - Get user's orders
- GET /api/orders/:id - Get order by ID
- POST /api/orders - Create new order
- PUT /api/orders/:id/status - Update order status
- GET /api/orders/:id/receipt - Get order receipt (PDF)

### Promo Codes
- GET /api/promo - Get all promo codes
- POST /api/promo - Create new promo code (admin only)
- POST /api/promo/validate - Validate promo code
- PUT /api/promo/:id - Update promo code (admin only)
- DELETE /api/promo/:id - Delete promo code (admin only)

### Admin
- GET /api/admin/dashboard - Get dashboard stats
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id/role - Update user role
- GET /api/admin/orders - Get all orders
- GET /api/admin/orders/export - Export orders to CSV
- GET /api/admin/audit-logs - Get audit logs

## License
MIT "# Foodie" 
