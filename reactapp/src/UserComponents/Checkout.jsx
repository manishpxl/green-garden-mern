import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ShoppingBag as CheckoutIcon, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import { CartContext } from '../CartContext';
import './Checkout.css';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const userId = user.userId;

    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (data) => {
        const orderItems = cart.map(item => ({
            plant: item.plantId,
            quantity: item.quantity
        }));

        try {
            await axios.post(`${apiConfig.baseUrl}/orders`, {
                orderItems,
                user: userId,
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress
            });
            setShowSuccess(true);
            clearCart();
        } catch (err) {
            toast.error(err.response?.data?.message || "Order placement failed.");
        }
    };

    if (showSuccess) {
        return (
            <div className="user-page">
                <UserNavbar />
                <div className="success-overlay">
                    <div className="success-modal">
                        <CheckCircle size={64} className="success-icon" />
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for shopping with Green Garden.</p>
                        <p>Your order will be processed shortly. You can track it in the My Orders section.</p>
                        <button className="continue-btn" onClick={() => navigate('/user/view-plants')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="user-page">
                <UserNavbar />
                <div className="empty-checkout">
                    <h2>Your Cart is Empty</h2>
                    <p>Please add items to your cart before proceeding to checkout.</p>
                    <button className="continue-btn" onClick={() => navigate('/user/view-plants')}>
                        Go to Catalog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="user-page">
            <UserNavbar />
            <div className="checkout-container">
                <h2><CheckoutIcon size={24} className="icon-mr" /> Checkout</h2>

                <div className="checkout-content">
                    <div className="checkout-form-section">
                        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
                            <div className="form-group">
                                <label>Shipping Address</label>
                                <textarea rows="3" placeholder="Enter full shipping address..."
                                    {...register('shippingAddress', { required: 'Shipping Address is required' })}></textarea>
                                {errors.shippingAddress && <span className="error-text">{errors.shippingAddress.message}</span>}
                            </div>

                            <div className="form-group">
                                <label>Billing Address</label>
                                <textarea rows="3" placeholder="Enter full billing address..."
                                    {...register('billingAddress', { required: 'Billing Address is required' })}></textarea>
                                {errors.billingAddress && <span className="error-text">{errors.billingAddress.message}</span>}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => navigate('/user/view-plants')}>Cancel</button>
                                <button type="submit" className="btn-place-order">Place Order <ArrowRight size={18} /></button>
                            </div>
                        </form>
                    </div>

                    <div className="invoice-section">
                        <h3>Order Summary</h3>
                        <div className="invoice-items">
                            {cart.map((item, index) => (
                                <div key={index} className="invoice-item">
                                    <div className="ii-info">
                                        <span className="ii-name">{item.name}</span>
                                        <span className="ii-qty">x {item.quantity}</span>
                                    </div>
                                    <div className="ii-price">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        <div className="invoice-totals">
                            <div className="total-row"><span>Subtotal</span><span>₹{getCartTotal()}</span></div>
                            <div className="total-row"><span>Shipping</span><span>Free</span></div>
                            <div className="total-row grand-total"><span>Total Amount</span><span>₹{getCartTotal()}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
