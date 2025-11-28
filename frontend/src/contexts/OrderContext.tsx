import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

interface OrderItem {
  item: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentMethod: 'Cash' | 'Online';
  promoCode?: {
    _id: string;
    code: string;
    discountType: 'Percentage' | 'Fixed';
    discountValue: number;
  };
  discount: number;
  finalAmount: number;
  deliveryLocation: string;
  orderTime: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  placeOrder: (orderData: any) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order>;
  getOrderHistory: () => Promise<void>;
  downloadReceipt: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Set up Socket.io connection
  useEffect(() => {
    if (isAuthenticated) {
      const socket = io(import.meta.env.VITE_API_URL);

      socket.on('orderStatusUpdate', (data) => {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === data.orderId
              ? { ...order, status: data.status }
              : order
          )
        );

        if (currentOrder?._id === data.orderId) {
          setCurrentOrder(prev => prev ? { ...prev, status: data.status } : null);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, currentOrder]);

  // Load order history when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getOrderHistory();
    } else {
      setOrders([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getOrderHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Failed to load order history');
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrder = async (orderData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData);
      const newOrder = response.data;
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
      const order = response.data;
      setCurrentOrder(order);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async (orderId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/receipt`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setError('Failed to download receipt');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status }
      );
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );

      if (currentOrder?._id === orderId) {
        setCurrentOrder(prev => prev ? { ...prev, status } : null);
      }

      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        error,
        placeOrder,
        getOrder,
        getOrderHistory,
        downloadReceipt,
        updateOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 