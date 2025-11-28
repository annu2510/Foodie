import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ totalAmount, deliveryAddress, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (paymentMethod === 'COD') {
            // Handle COD payment
            try {
                const response = await axios.post('/api/orders', {
                    items: cart.items,
                    totalAmount,
                    deliveryAddress,
                    paymentMethod: 'COD'
                });
                onSuccess(response.data.order);
            } catch (error) {
                setError('Error creating order. Please try again.');
            }
        } else {
            // Handle card payment
            if (!stripe || !elements) {
                return;
            }

            try {
                const response = await axios.post('/api/orders', {
                    items: cart.items,
                    totalAmount,
                    deliveryAddress,
                    paymentMethod: 'CARD'
                });

                const { clientSecret } = response.data;

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    }
                });

                if (result.error) {
                    setError(result.error.message);
                } else {
                    onSuccess(response.data.order);
                }
            } catch (error) {
                setError('Error processing payment. Please try again.');
            }
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        Cash on Delivery
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="CARD"
                            checked={paymentMethod === 'CARD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        Card Payment
                    </label>
                </div>
            </div>

            {paymentMethod === 'CARD' && (
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Card Details</label>
                    <div className="border rounded p-3">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}

            <button
                type="submit"
                disabled={processing || (paymentMethod === 'CARD' && !stripe)}
                className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:bg-gray-400"
            >
                {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
        </form>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const totalAmount = cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setDeliveryAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOrderSuccess = (order) => {
        clearCart();
        navigate(`/orders/${order._id}`);
    };

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/menu')}
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={deliveryAddress.street}
                                onChange={handleAddressChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={deliveryAddress.city}
                                onChange={handleAddressChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={deliveryAddress.state}
                                onChange={handleAddressChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">ZIP Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={deliveryAddress.zipCode}
                                onChange={handleAddressChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="bg-gray-50 p-4 rounded">
                        {cart.items.map((item) => (
                            <div key={item._id} className="flex justify-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between font-semibold">
                                <span>Total Amount</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Payment</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                totalAmount={totalAmount}
                                deliveryAddress={deliveryAddress}
                                onSuccess={handleOrderSuccess}
                            />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 