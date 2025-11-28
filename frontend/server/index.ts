import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// In-memory storage for carts (in a real app, this would be a database)
const carts = new Map();

// Get cart
app.get('/api/cart', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  const cart = carts.get(userId) || [];
  res.json(cart);
});

// Add item to cart
app.post('/api/cart', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  const { item, quantity } = req.body;
  
  let cart = carts.get(userId) || [];
  const existingItemIndex = cart.findIndex(cartItem => cartItem.item._id === item);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ item, quantity });
  }
  
  carts.set(userId, cart);
  res.json(cart);
});

// Update item quantity
app.put('/api/cart/:itemId', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  const { itemId } = req.params;
  const { quantity } = req.body;
  
  let cart = carts.get(userId) || [];
  const itemIndex = cart.findIndex(cartItem => cartItem.item._id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity > 0) {
      cart[itemIndex].quantity = quantity;
    } else {
      cart.splice(itemIndex, 1);
    }
    carts.set(userId, cart);
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
});

// Remove item from cart
app.delete('/api/cart/:itemId', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  const { itemId } = req.params;
  
  let cart = carts.get(userId) || [];
  const itemIndex = cart.findIndex(cartItem => cartItem.item._id === itemId);
  
  if (itemIndex >= 0) {
    cart.splice(itemIndex, 1);
    carts.set(userId, cart);
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
});

// Clear cart
app.delete('/api/cart', (req, res) => {
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  carts.delete(userId);
  res.json([]);
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
