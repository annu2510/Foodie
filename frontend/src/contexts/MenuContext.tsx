import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Beverages';
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  ratings: {
    user: string;
    rating: number;
    review?: string;
    date: string;
  }[];
  averageRating: number;
}

interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  getItems: () => Promise<void>;
  getItem: (id: string) => Promise<MenuItem>;
  addItem: (itemData: Partial<MenuItem>) => Promise<MenuItem>;
  updateItem: (id: string, itemData: Partial<MenuItem>) => Promise<MenuItem>;
  deleteItem: (id: string) => Promise<void>;
  rateItem: (id: string, rating: number, review?: string) => Promise<MenuItem>;
  getItemsByCategory: (category: string) => MenuItem[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];

  // Load menu items on mount
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const getItem = async (id: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  };

  const addItem = async (itemData: Partial<MenuItem>) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/menu`, itemData);
      setItems(prevItems => [...prevItems, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, itemData: Partial<MenuItem>) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/menu/${id}`, itemData);
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? response.data : item
        )
      );
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Not authorized');
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/menu/${id}`);
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const rateItem = async (id: string, rating: number, review?: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/menu/${id}/rate`, {
        rating,
        review
      });
      
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? response.data : item
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Error rating menu item:', error);
      throw error;
    }
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        isLoading,
        error,
        getItems,
        getItem,
        addItem,
        updateItem,
        deleteItem,
        rateItem,
        getItemsByCategory
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}; 