import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { mockMenuItems } from '../mockData';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

const HomePage: React.FC = () => {
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // In a real app, we would fetch this data from the API
    const topRatedItems = [...mockMenuItems]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
    
    setPopularItems(topRatedItems);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
            alt="Campus Food" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Delicious Food,<br />Delivered To You
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Skip the lines and order your favorite campus food directly through Foodie!
          </p>
          <Link 
            to="/menu" 
            className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors duration-300 animate-fade-in-up"
          >
            Order Now
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-semibold text-orange-600 dark:text-orange-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Browse Menu</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore our diverse selection of delicious campus favorites.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-semibold text-orange-600 dark:text-orange-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Place Your Order</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select your items, customize as needed, and proceed to checkout.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-semibold text-orange-600 dark:text-orange-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Enjoy Your Meal</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your order in real-time and pick it up when it's ready!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold dark:text-white">Popular Items</h2>
            <Link 
              to="/menu" 
              className="text-orange-600 dark:text-orange-400 font-medium flex items-center hover:text-orange-700 dark:hover:text-orange-300"
            >
              View All <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium dark:text-white">{item.name}</h3>
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md text-sm font-medium">
                      {formatCurrency(item.price, 'INR')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={16} className="mr-1" />
                      <span>{item.preparationTime} mins</span>
                    </div>
                    <div className="flex items-center text-sm text-yellow-500">
                      <Star size={16} className="mr-1 fill-current" />
                      <span>{item.rating?.toFixed(1) || "New"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our menu and satisfy your cravings with just a few clicks!
          </p>
          <Link 
            to="/menu" 
            className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Browse Menu
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;