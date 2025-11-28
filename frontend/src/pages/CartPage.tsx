import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Trash2, ArrowRight, ShoppingCart, MapPin, Edit2, Trash } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../config/config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

interface Address {
  _id: string;
  fullName: string;
  mobileNumber: string;
  building: string;
  roomNumber: string;
  landmark: string;
  addressType: 'Home' | 'Office' | 'Hostel' | 'Other';
  pinCode?: string;
  city?: string;
  isDefault: boolean;
}

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [newAddress, setNewAddress] = useState<Omit<Address, '_id' | 'isDefault'>>({
    fullName: '',
    mobileNumber: '',
    building: '',
    roomNumber: '',
    landmark: '',
    addressType: 'Hostel',
    pinCode: '',
    city: ''
  });

  useEffect(() => {
    // Load saved addresses when component mounts
    const loadAddresses = async () => {
      try {
        const response = await api.get('/user/addresses');
        setAddresses(response.data);
        // Set default address if exists
        const defaultAddress = response.data.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Failed to load addresses');
        } else {
          toast.error('Failed to load addresses');
        }
      }
    };

    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/addresses', {
        ...newAddress,
        // Ensure all required fields are present and properly formatted
        fullName: newAddress.fullName.trim(),
        mobileNumber: newAddress.mobileNumber.trim(),
        building: newAddress.building.trim(),
        roomNumber: newAddress.roomNumber.trim(),
        landmark: newAddress.landmark.trim(),
        addressType: newAddress.addressType
      });

      // Update the addresses state with the new address
      const newAddressWithId = {
        ...response.data,
        _id: response.data._id // Convert _id to id for frontend use
      };
      
      setAddresses(prev => [...prev, newAddressWithId]);
      setSelectedAddress(newAddressWithId._id);
      setShowAddressForm(false);
      
      // Reset the form
      setNewAddress({
        fullName: '',
        mobileNumber: '',
        building: '',
        roomNumber: '',
        landmark: '',
        addressType: 'Hostel',
        pinCode: '',
        city: ''
      });
      
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to add address';
        const missingFields = error.response?.data?.fields;
        if (missingFields) {
          toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Failed to add address');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}/default`);
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        }))
      );
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update default address');
      } else {
        toast.error('Failed to update default address');
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await api.delete(`/user/addresses/${addressId}`);
      setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      if (selectedAddress === addressId) {
        setSelectedAddress('');
      }
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete address');
      } else {
        toast.error('Failed to delete address');
      }
    }
  };

  const applyPromoCode = () => {
    // In a real app, this would validate the promo code against the backend
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoDiscount(totalAmount * 0.1);
      setPromoCodeError('');
    } else {
      setPromoDiscount(0);
      setPromoCodeError('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart', message: 'Please log in to complete your order' } });
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setIsProcessing(true);
      
      const orderData = {
        items: items.map(item => ({
          menuItem: item.item._id,
          quantity: item.quantity,
          price: item.item.price
        })),
        totalAmount: totalAmount - promoDiscount,
        paymentMethod: 'COD',
        deliveryAddressId: selectedAddress,
        specialInstructions,
        promoCode: promoCode || undefined
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to place order');
      } else {
        toast.error('Failed to place order');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTax = totalAmount * 0.08;
  const deliveryFee = 0;
  const total = totalAmount + calculateTax - promoDiscount;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center mb-6">
          <Link to="/menu" className="flex items-center text-orange-600 hover:text-orange-700">
            <ChevronLeft size={20} className="mr-1" />
            <span>Back to Menu</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            {items.length > 0 ? (
              <div>
                <div className="bg-white rounded-lg shadow-md">
                  <div className="hidden md:flex py-4 px-6 border-b border-gray-200">
                    <div className="w-6/12">
                      <h3 className="font-medium">Item</h3>
                    </div>
                    <div className="w-2/12 text-center">
                      <h3 className="font-medium">Price</h3>
                    </div>
                    <div className="w-3/12 text-center">
                      <h3 className="font-medium">Quantity</h3>
                    </div>
                    <div className="w-1/12 text-right">
                      <h3 className="font-medium">Total</h3>
                    </div>
                  </div>
                  
                  {items.map((cartItem) => (
                    <div 
                      key={cartItem.item._id} 
                      className="py-4 px-6 border-b border-gray-200 last:border-0 flex flex-col md:flex-row md:items-center"
                    >
                      {/* Item Info */}
                      <div className="w-full md:w-6/12 flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                          <img 
                            src={cartItem.item.image} 
                            alt={cartItem.item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{cartItem.item.name}</h4>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="w-full md:w-2/12 flex justify-between md:justify-center items-center mb-2 md:mb-0">
                        <span className="md:hidden text-gray-600">Price:</span>
                        <span>${cartItem.item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity Control */}
                      <div className="w-full md:w-3/12 flex justify-between md:justify-center items-center mb-2 md:mb-0">
                        <span className="md:hidden text-gray-600">Quantity:</span>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-3 min-w-[20px] text-center">
                            {cartItem.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(cartItem.item._id)}
                          className="p-1 rounded-full text-red-500 hover:text-red-700 md:hidden"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="w-full md:w-1/12 flex justify-between md:justify-end items-center">
                        <span className="md:hidden text-gray-600">Total:</span>
                        <span className="font-medium">
                          ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeItem(cartItem.item._id)}
                          className="p-1 rounded-full text-red-500 hover:text-red-700 hidden md:block"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Section */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Delivery Address</h3>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center text-orange-600 hover:text-orange-700"
                    >
                      <Plus size={20} className="mr-1" />
                      Add New Address
                    </button>
                  </div>

                  {/* Saved Addresses */}
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-lg p-4 ${
                          selectedAddress === address._id ? 'border-orange-500' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address._id}
                              checked={selectedAddress === address._id}
                              onChange={(e) => setSelectedAddress(e.target.value)}
                              className="mt-1"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{address.fullName}</h4>
                                {address.isDefault && (
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.building}, Room {address.roomNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                Near {address.landmark}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.mobileNumber}
                              </p>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mt-2 inline-block">
                                {address.addressType}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address._id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* New Address Form */}
                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={newAddress.fullName}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            name="mobileNumber"
                            value={newAddress.mobileNumber}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hostel/Block/Building Name
                          </label>
                          <input
                            type="text"
                            name="building"
                            value={newAddress.building}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room/Flat Number
                          </label>
                          <input
                            type="text"
                            name="roomNumber"
                            value={newAddress.roomNumber}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Campus Area or Landmark
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={newAddress.landmark}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="e.g., Cafeteria, Admin Block"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type
                          </label>
                          <select
                            name="addressType"
                            value={newAddress.addressType}
                            onChange={handleAddressChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="Hostel">Hostel</option>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pin Code (Optional)
                          </label>
                          <input
                            type="text"
                            name="pinCode"
                            value={newAddress.pinCode}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City (Optional)
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4 text-gray-400">
                  <ShoppingCart size={64} />
                </div>
                <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any items to your cart yet.
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
          
          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>${calculateTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Apply
                  </button>
                </div>
                {promoCodeError && (
                  <p className="text-red-600 text-sm mt-1">{promoCodeError}</p>
                )}
              </div>

              {/* Special Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  rows={3}
                  placeholder="Any special instructions for your order?"
                />
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className={`w-full mt-6 px-6 py-3 rounded-md flex items-center justify-center space-x-2 ${
                  isProcessing || items.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white font-medium`}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;