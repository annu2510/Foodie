import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  Calendar,
  Check,
  X
} from 'lucide-react';
import { mockOrders } from '../../mockData';
import { Order, OrderStatus } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch this data from the API
    const fetchOrders = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search, status, and date range
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      order.id.toLowerCase().includes(searchLower) || 
      order.items.some(item => item.name.toLowerCase().includes(searchLower));
    
    // Status filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    // Date range filter
    let dateMatch = true;
    const orderDate = new Date(order.createdAt);
    
    if (dateRange.start && !isNaN(new Date(dateRange.start).getTime())) {
      dateMatch = dateMatch && orderDate >= new Date(dateRange.start);
    }
    
    if (dateRange.end && !isNaN(new Date(dateRange.end).getTime())) {
      // Include the full end day
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && orderDate <= endDate;
    }
    
    return searchMatch && statusMatch && dateMatch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const exportOrdersToCSV = () => {
    // In a real app, we would generate and download a CSV file
    console.log('Exporting orders to CSV...');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Manage Orders</h1>
          <button
            onClick={exportOrdersToCSV}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export to CSV
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Status Filter */}
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || statusFilter !== 'all' || dateRange.start || dateRange.end) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateRange({ start: '', end: '' });
                }}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Orders List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                    onClick={() => openOrderDetails(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {order.items.slice(0, 2).map(item => item.name).join(', ')}
                        {order.items.length > 2 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {order.paymentMethod}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderDetails(order);
                        }}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No orders found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Sidebar */}
      {detailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">Order Details</h2>
                <button
                  onClick={closeOrderDetails}
                  className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Order #{selectedOrder.id.slice(-8)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}{' '}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              {/* Update Status */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Update Order Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    disabled={selectedOrder.status === 'confirmed'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedOrder.status === 'confirmed'
                        ? 'bg-blue-200 text-blue-800 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                    disabled={selectedOrder.status === 'preparing'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedOrder.status === 'preparing'
                        ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900/70'
                    }`}
                  >
                    Preparing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                    disabled={selectedOrder.status === 'ready'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedOrder.status === 'ready'
                        ? 'bg-green-200 text-green-800 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/70'
                    }`}
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={selectedOrder.status === 'delivered'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-purple-200 text-purple-800 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/70'
                    }`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-red-200 text-red-800 cursor-not-allowed'
                        : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Order Items
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-600">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.price.toFixed(2)} each
                          </span>
                          <span className="text-sm font-medium dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* User & Delivery Info */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Info
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm dark:text-white">User ID: {selectedOrder.userId}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pickup Location
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm dark:text-white">
                      {selectedOrder.deliveryLocation || 'Counter Pickup'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Details
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Method:
                    </span>
                    <span className="text-sm font-medium dark:text-white capitalize">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span className={`text-sm font-medium ${
                      selectedOrder.paymentStatus === 'completed' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    } capitalize`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Instructions
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm dark:text-white">
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Order Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="dark:text-white">${(selectedOrder.total * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="dark:text-white">${(selectedOrder.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <Download size={18} className="mr-2" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;