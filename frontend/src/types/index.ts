// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'kitchen';
  profileImage?: string;
}

// Menu related types
export interface MenuItem {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  preparationTime: number; // in minutes
  tags?: string[];
  rating?: number;
}

// Cart related types
export interface CartItem {
  item: MenuItem;
  quantity: number;
}

// Order related types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: MenuItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}

// Review related types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Promo code related types
export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}