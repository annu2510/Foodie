import { Star, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  preparationTime: number;
  category: string;
  tags?: string[];
  onAddToCart: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  description,
  price,
  image,
  rating,
  preparationTime,
  tags,
  onAddToCart
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
          <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md text-sm font-medium">
            {formatCurrency(price)}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
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
            <span>{preparationTime} mins</span>
          </div>
          {rating && (
            <div className="flex items-center text-sm text-yellow-500">
              <Star size={16} className="mr-1 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md flex items-center justify-center transition-colors"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItem; 