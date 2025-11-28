import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/my-orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching orders. Please try again later.');
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post(`/api/orders/${orderId}/cancel`);
            // Refresh orders after cancellation
            fetchOrders();
        } catch (error) {
            setError('Error cancelling order. Please try again later.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PLACED':
                return 'bg-blue-100 text-blue-800';
            case 'PREPARING':
                return 'bg-yellow-100 text-yellow-800';
            case 'OUT_FOR_DELIVERY':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl mb-4">No orders yet</h2>
                <Link
                    to="/menu"
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Order #{order._id.slice(-6)}
                                </h3>
                                <p className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className="border-t border-b py-4 mb-4">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex justify-between items-center mb-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Total Amount</span>
                            <span className="font-semibold">₹{order.totalAmount}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                <p>Payment Method: {order.paymentMethod}</p>
                                <p>Delivery Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                            </div>
                            {order.status === 'PLACED' && (
                                <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory; 