import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Clock, ChefHat, Package, Download, Star } from 'lucide-react';
import { mockOrders } from '../mockData';
import { Order, OrderStatus } from '../types';

const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // In a real app, we would fetch this data from the API
    const fetchOrder = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundOrder = mockOrders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusStep = (status: OrderStatus): number => {
    const statusSteps: {[key in OrderStatus]: number} = {
      'pending': 0,
      'confirmed': 1,
      'preparing': 2,
      'ready': 3,
      'delivered': 4,
      'cancelled': -1
    };
    return statusSteps[status];
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const statusLabels: {[key in OrderStatus]: string} = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready for Pickup',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusLabels[status];
  };

  const getStatusIcon = (stepNumber: number, currentStatus: number) => {
    if (stepNumber < currentStatus) {
      return <CheckCircle size={24} className="text-green-500" />;
    } else if (stepNumber === currentStatus) {
      switch (stepNumber) {
        case 0: // Pending
          return <Clock size={24} className="text-orange-500 animate-pulse" />;
        case 1: // Confirmed
          return <CheckCircle size={24} className="text-orange-500" />;
        case 2: // Preparing
          return <ChefHat size={24} className="text-orange-500 animate-pulse" />;
        case 3: // Ready
          return <Package size={24} className="text-orange-500" />;
        case 4: // Delivered
          return <CheckCircle size={24} className="text-green-500" />;
        default:
          return <Clock size={24} className="text-gray-400" />;
      }
    } else {
      return <Clock size={24} className="text-gray-400" />;
    }
  };

  const handleRateItem = (itemId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleSubmitRatings = () => {
    console.log('Submitted ratings:', ratings);
    // In a real app, we would submit these ratings to the API
    setRatingVisible(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-medium mb-4 dark:text-white">Order Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusStep = getStatusStep(order.status);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {/* Order Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Order #{order.id.slice(-8)}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'cancelled' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                }`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {order.status !== 'cancelled' && (
                <div className="mb-8">
                  {/* Progress Steps */}
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700"></div>
                    <div 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentStatusStep / 4) * 100)}%` }}
                    ></div>
                    <div className="relative flex justify-between">
                      {/* Pending Step */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center z-10">
                          {getStatusIcon(0, currentStatusStep)}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Pending</span>
                      </div>
                      
                      {/* Confirmed Step */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center z-10">
                          {getStatusIcon(1, currentStatusStep)}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Confirmed</span>
                      </div>
                      
                      {/* Preparing Step */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center z-10">
                          {getStatusIcon(2, currentStatusStep)}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Preparing</span>
                      </div>
                      
                      {/* Ready Step */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center z-10">
                          {getStatusIcon(3, currentStatusStep)}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Ready</span>
                      </div>
                      
                      {/* Delivered Step */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center z-10">
                          {getStatusIcon(4, currentStatusStep)}
                        </div>
                        <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Delivered</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="mt-6 text-center">
                    <p className="text-lg font-medium dark:text-white">
                      {order.status === 'pending' && 'Your order is being processed...'}
                      {order.status === 'confirmed' && 'Your order has been confirmed!'}
                      {order.status === 'preparing' && 'Your order is being prepared...'}
                      {order.status === 'ready' && 'Your order is ready for pickup!'}
                      {order.status === 'delivered' && 'Your order has been delivered!'}
                    </p>
                    {order.status === 'preparing' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Estimated preparation time: 15-20 minutes
                      </p>
                    )}
                    {order.status === 'ready' && (
                      <p className="text-sm text-green-600 dark:text-green-500 mt-1 font-medium">
                        Please proceed to the pickup counter and show your order number
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {order.status === 'cancelled' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400 font-medium">
                    This order has been cancelled.
                  </p>
                </div>
              )}
              
              {/* Order Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                {order.status === 'delivered' && !ratingVisible && (
                  <button
                    onClick={() => setRatingVisible(true)}
                    className="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 dark:hover:bg-gray-800"
                  >
                    <Star size={18} className="mr-2" />
                    Rate Items
                  </button>
                )}
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download size={18} className="mr-2" />
                  Download Receipt
                </button>
                <Link
                  to="/orders"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                >
                  View All Orders
                </Link>
              </div>
            </div>
            
            {/* Rate Items Section */}
            {ratingVisible && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Rate Your Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="font-medium dark:text-white">{item.name}</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateItem(item.id, star)}
                            className="p-1"
                          >
                            <Star 
                              size={20} 
                              className={`${
                                (ratings[item.id] || 0) >= star 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-400 dark:text-gray-600'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setRatingVisible(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRatings}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                  >
                    Submit Ratings
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Details Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Details</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                  <span className="dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Time:</span>
                  <span className="dark:text-white">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="capitalize dark:text-white">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                  <span className="capitalize dark:text-white">
                    {order.paymentStatus}
                  </span>
                </div>
                {order.deliveryLocation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pickup Location:</span>
                    <span className="dark:text-white">
                      {order.deliveryLocation}
                    </span>
                  </div>
                )}
              </div>
              
              {order.specialInstructions && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Special Instructions:
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {order.specialInstructions}
                  </p>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="font-medium mb-3 dark:text-white">Order Items</h3>
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">
                          {item.quantity}x
                        </span>
                        <span className="dark:text-white">{item.name}</span>
                      </div>
                      <span className="dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="dark:text-white">${(order.total * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="dark:text-white">${(order.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Pickup Fee</span>
                  <span className="dark:text-white">$0.00</span>
                </div>
                <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;