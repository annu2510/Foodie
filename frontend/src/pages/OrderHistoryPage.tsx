import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ShoppingCart, ArrowRight } from 'lucide-react';
import { mockOrders } from '../mockData';
import { Order } from '../types';

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const fetchOrders = async () => {
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter(order => {
      if (selectedFilter === 'all') return true;
      return order.status === selectedFilter;
    })
    .filter(order => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.total - a.total;
        case 'lowest':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status];
  };

  const reorderItems = (orderId: string) => {
    // In a real app, we would add these items to the cart
    console.log('Reordering items from order:', orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Order List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <span className="text-lg font-semibold">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex flex-wrap -mx-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="px-2 mb-2 flex items-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden mr-2">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="text-sm text-gray-800">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="px-2 mb-2">
                          <span className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/order/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                      <button
                        onClick={() => reorderItems(order.id)}
                        className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4 text-gray-400">
              <ShoppingCart size={64} />
            </div>
            <h2 className="text-2xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedFilter !== 'all'
                ? "We couldn't find any orders matching your filters. Try adjusting your search."
                : "You haven't placed any orders yet. Browse our menu to get started!"}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
            >
              Browse Menu
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;