import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  ArrowRight, 
  Star, 
  Clock, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';
import { mockOrders, mockMenuItems } from '../../mockData';

const AdminDashboard: React.FC = () => {
  // Calculate dashboard statistics
  const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(
    order => ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).length;
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get top selling items
  const itemSalesMap = new Map<string, { name: string; image: string; count: number; revenue: number }>();
  
  mockOrders.forEach(order => {
    order.items.forEach(item => {
      const currentItem = itemSalesMap.get(item.id) || { 
        name: item.name, 
        image: item.image, 
        count: 0, 
        revenue: 0 
      };
      
      currentItem.count += item.quantity;
      currentItem.revenue += item.price * item.quantity;
      
      itemSalesMap.set(item.id, currentItem);
    });
  });
  
  const topSellingItems = Array.from(itemSalesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Get highest rated items
  const highestRatedItems = [...mockMenuItems]
    .filter(item => item.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <Link 
            to="/admin/orders" 
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
          >
            Manage Orders
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sales</p>
                <h2 className="text-3xl font-bold mt-2 dark:text-white">${totalSales.toFixed(2)}</h2>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign size={24} className="text-green-600 dark:text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-green-600 dark:text-green-500 text-sm font-medium">
                <ChevronUp size={16} className="mr-1" />
                12.5%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
          
          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Orders</p>
                <h2 className="text-3xl font-bold mt-2 dark:text-white">{totalOrders}</h2>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingBag size={24} className="text-blue-600 dark:text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-green-600 dark:text-green-500 text-sm font-medium">
                <ChevronUp size={16} className="mr-1" />
                8.2%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
          
          {/* Pending Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Orders</p>
                <h2 className="text-3xl font-bold mt-2 dark:text-white">{pendingOrders}</h2>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock size={24} className="text-orange-600 dark:text-orange-500" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-red-600 dark:text-red-500 text-sm font-medium">
                <ChevronDown size={16} className="mr-1" />
                3.1%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
          
          {/* Average Order Value */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg. Order Value</p>
                <h2 className="text-3xl font-bold mt-2 dark:text-white">${avgOrderValue.toFixed(2)}</h2>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp size={24} className="text-purple-600 dark:text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="flex items-center text-green-600 dark:text-green-500 text-sm font-medium">
                <ChevronUp size={16} className="mr-1" />
                5.3%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Top Selling Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium dark:text-white truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.count} sold • ${item.revenue.toFixed(2)} revenue
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="text-right">
                        <span className="text-lg font-semibold dark:text-white">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/admin/menu" 
                  className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-500"
                >
                  View all menu items
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Highest Rated Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Highest Rated Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {highestRatedItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium dark:text-white truncate">{item.name}</h3>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={`${
                                i < Math.floor(item.rating || 0) 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {item.rating?.toFixed(1)} ({item.reviews?.length || 0} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 rounded-md text-sm font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/admin/menu" 
                  className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-500"
                >
                  View all menu items
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;