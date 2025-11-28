import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Types
interface CartItem {
  item: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.baseURL = API_URL;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  // Configure axios auth header
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated]);

  // Initialize cart
  useEffect(() => {
    if (isAuthenticated && isApiAvailable) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated, isApiAvailable]);

  // Save local cart changes
  useEffect(() => {
    if ((!isAuthenticated || !isApiAvailable) && !isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, isLoading, isApiAvailable]);

  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      setItems(savedCart ? JSON.parse(savedCart) : []);
    } catch (error) {
      console.error('Error loading local cart:', error);
      setItems([]);
    }
    setIsLoading(false);
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      setItems(response.data || []);
      setIsApiAvailable(true);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      setItems([]);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        setIsApiAvailable(false);
        loadLocalCart(); // Fallback to local storage if API is not available
      } else if (error.response?.status !== 404) {
        toast.error('Failed to load cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: any, quantity: number): Promise<void> => {
    try {
      const itemId = item._id || item.id;
      if (!itemId) {
        throw new Error('Invalid item: missing ID');
      }

      if (isAuthenticated && isApiAvailable) {
        try {
          await axios.post('/api/cart', { item: itemId, quantity });
          await fetchCart();
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
            setIsApiAvailable(false);
            // Fallback to local storage
            handleLocalAdd(item, quantity);
          } else {
            throw error;
          }
        }
      } else {
        handleLocalAdd(item, quantity);
      }
      toast.success('Item added to cart');
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const handleLocalAdd = (item: any, quantity: number) => {
    const itemId = item._id || item.id;
    setItems(prevItems => {
      const existingItem = prevItems.find(i => (i.item._id || i.item.id) === itemId);
      if (existingItem) {
        return prevItems.map(i =>
          (i.item._id || i.item.id) === itemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevItems, {
        item: {
          _id: itemId,
          name: item.name,
          price: item.price,
          image: item.image
        },
        quantity
      }];
    });
  };

  const removeItem = async (itemId: string): Promise<void> => {
    try {
      if (isAuthenticated && isApiAvailable) {
        try {
          await axios.delete(`/api/cart/${itemId}`);
          await fetchCart();
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
            setIsApiAvailable(false);
            handleLocalRemove(itemId);
          } else {
            throw error;
          }
        }
      } else {
        handleLocalRemove(itemId);
      }
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleLocalRemove = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => 
      (item.item._id || item.item.id) !== itemId
    ));
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<void> => {
    try {
      if (quantity < 1) {
        await removeItem(itemId);
        return;
      }

      if (isAuthenticated && isApiAvailable) {
        try {
          await axios.put(`/api/cart/${itemId}`, { quantity });
          await fetchCart();
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
            setIsApiAvailable(false);
            handleLocalUpdate(itemId, quantity);
          } else {
            throw error;
          }
        }
      } else {
        handleLocalUpdate(itemId, quantity);
      }
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleLocalUpdate = (itemId: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        (item.item._id || item.item.id) === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = async (): Promise<void> => {
    try {
      if (isAuthenticated && isApiAvailable) {
        try {
          await axios.delete('/api/cart');
          await fetchCart();
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
            setIsApiAvailable(false);
            handleLocalClear();
          } else {
            throw error;
          }
        }
      } else {
        handleLocalClear();
      }
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleLocalClear = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 