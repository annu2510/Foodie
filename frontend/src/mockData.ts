import { MenuItem, Order } from './types';

export const mockMenuItems: MenuItem[] = [
  {
    _id: "item1",
    id: "item1",
    name: "Classic Breakfast Sandwich",
    description: "Freshly baked croissant filled with scrambled eggs, cheddar cheese, and your choice of bacon or sausage. Perfect for a quick breakfast on campus.",
    price: 199,
    category: "Breakfast",
    image: "https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg",
    preparationTime: 10,
    tags: ["breakfast", "sandwich", "quick"],
    rating: 4.7
  },
  {
    _id: "item2",
    id: "item2",
    name: "Avocado Toast",
    description: "Multigrain toast topped with freshly mashed avocado, cherry tomatoes, microgreens, and a sprinkle of everything bagel seasoning. Served with a side of fruit.",
    price: 249,
    category: "Breakfast",
    image: "https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg",
    preparationTime: 8,
    tags: ["vegetarian", "breakfast", "healthy"],
    rating: 4.5
  },
  {
    _id: "item3",
    id: "item3",
    name: "Greek Yogurt Parfait",
    description: "Layers of creamy Greek yogurt, homemade granola, fresh berries, and honey. A protein-packed breakfast to fuel your morning classes.",
    price: 179,
    category: "Breakfast",
    image: "https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg",
    preparationTime: 5,
    tags: ["vegetarian", "breakfast", "healthy", "quick"],
    rating: 4.3
  },
  {
    _id: "item4",
    id: "item4",
    name: "Chicken Caesar Wrap",
    description: "Grilled chicken, crisp romaine lettuce, parmesan cheese, and creamy Caesar dressing wrapped in a spinach tortilla. Served with kettle chips.",
    price: 299,
    category: "Lunch",
    image: "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg",
    preparationTime: 12,
    tags: ["lunch", "wrap", "protein"],
    rating: 4.6
  },
  {
    _id: "item5",
    id: "item5",
    name: "Caprese Panini",
    description: "Fresh mozzarella, tomatoes, basil, and balsamic glaze pressed between ciabatta bread. Served warm with a side salad.",
    price: 249,
    category: "Lunch",
    image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
    preparationTime: 15,
    tags: ["vegetarian", "lunch", "hot"],
    rating: 4.8
  },
  {
    _id: "item6",
    id: "item6",
    name: "Southwest Quinoa Bowl",
    description: "Protein-packed quinoa topped with black beans, roasted corn, avocado, pico de gallo, and cilantro lime dressing. Customize with your choice of protein.",
    price: 149,
    category: "Lunch",
    image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg",
    preparationTime: 12,
    tags: ["vegetarian", "vegan-option", "gluten-free", "lunch", "bowl"],
    rating: 4.7
  },
  {
    _id: "item7",
    id: "item7",
    name: "Margherita Pizza",
    description: "Hand-tossed pizza crust topped with San Marzano tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil. Available by the slice or as a whole pizza.",
    price: 49,
    category: "Dinner",
    image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    preparationTime: 20,
    tags: ["vegetarian", "pizza", "dinner", "italian"],
    rating: 4.9
  },
  {
    _id: "item8",
    id: "item8",
    name: "Beef Stir Fry",
    description: "Thinly sliced beef stir-fried with mixed vegetables in a savory teriyaki sauce. Served over steamed rice.",
    price: 49,
    category: "Dinner",
    image: "https://images.pexels.com/photos/262897/pexels-photo-262897.jpeg",
    preparationTime: 18,
    tags: ["dinner", "asian", "protein"],
    rating: 4.5
  },
  {
    _id: "item9",
    id: "item9",
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice. Customize with your choice of milk, sweetener, and flavored syrups.",
    price: 39,
    category: "Beverages",
    image: "https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg",
    preparationTime: 3,
    tags: ["beverage", "caffeine", "quick"],
    rating: 4.7
  },
  {
    _id: "item10",
    id: "item10",
    name: "Chocolate Chip Cookie",
    description: "Freshly baked cookie with semi-sweet chocolate chips and a soft, chewy center. The perfect study break treat!",
    price: 99,
    category: "Desserts",
    image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg",
    preparationTime: 5,
    tags: ["dessert", "sweet", "vegetarian"],
    rating: 4.8
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: mockMenuItems.slice(0, 3),
    status: 'delivered',
    total: 627,
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    items: mockMenuItems.slice(3, 5),
    status: 'preparing',
    total: 548,
    createdAt: '2024-01-21T14:20:00Z'
  }
];