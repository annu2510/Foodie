import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ShoppingCart, Star } from 'lucide-react';
import { mockMenuItems } from '../mockData';
import { MenuItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const categories = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Beverages',
  'Desserts'
];

const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { addItem } = useCart();

  // Load menu items on component mount
  useEffect(() => {
    setItems(mockMenuItems);
    setFilteredItems(mockMenuItems);
  }, []);

  // Filter and sort items
  useEffect(() => {
    let result = [...items];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredItems(result);
  }, [items, selectedCategory, searchQuery, sortOption]);

  const handleAddToCart = async (item: any) => {
    if (addingToCart === (item._id || item.id)) return;
    
    setAddingToCart(item._id || item.id);
    try {
      await addItem(item, 1);
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Our Menu</h1>
      
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 md:max-w-xs">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-orange-500 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          {filteredItems.length} items found
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md text-sm font-medium">
                  ₹{item.price}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              {item.tags && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.preparationTime} mins</span>
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <Star size={16} className="mr-1 fill-current" />
                  <span>{item.rating?.toFixed(1)}</span>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                disabled={addingToCart === (item._id || item.id)}
                className={`w-full py-2 ${
                  addingToCart === (item._id || item.id)
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white font-medium rounded-md flex items-center justify-center transition-colors`}
              >
                {addingToCart === (item._id || item.id) ? (
                  'Adding...'
                ) : (
                  <>
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;