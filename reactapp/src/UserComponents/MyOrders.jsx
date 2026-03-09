import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, MapPin, X, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import './MyOrders.css';

const MyOrders = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo?.userId) return;
            try {
                const res = await axios.get(`${apiConfig.baseUrl}/orders/user/${userInfo.userId}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setOrders([]);
            }
        };
        fetchOrders();
    }, [userInfo]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await axios.put(`${apiConfig.baseUrl}/orders/${orderId}`, { orderStatus: 'Cancelled' });
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
                toast.success("Order cancelled successfully.");
            } catch (err) {
                toast.error("Error cancelling order.");
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': { icon: <Clock size={14} />, className: 'pending' },
            'Processing': { icon: <Package size={14} />, className: 'processing' },
            'Shipped': { icon: <Truck size={14} />, className: 'shipped' },
            'Delivered': { icon: <CheckCircle size={14} />, className: 'delivered' },
            'Cancelled': { icon: <XCircle size={14} />, className: 'cancelled' }
        };
        const s = statusMap[status] || statusMap['Pending'];
        return <span className={`status-badge ${s.className}`}>{s.icon} {status}</span>;
    };

    const trackingSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    return (
        <div className="user-page">
            <UserNavbar />
            <div className="my-orders-container">
                <h2>My Orders</h2>
                {orders.length === 0 ? (
                    <div className="no-orders">You haven't placed any orders yet.</div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div className="order-card" key={order._id}>
                                <div className="order-card-header">
                                    <div className="order-id">Order #{order._id?.slice(-8)}</div>
                                    <div>{getStatusBadge(order.orderStatus)}</div>
                                </div>
                                <div className="order-card-body">
                                    <div className="order-info-row">
                                        <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                                        <span className="order-total">₹{order.totalAmount}</span>
                                    </div>
                                    <div className="order-info-row">
                                        <span><MapPin size={14} /> {order.shippingAddress}</span>
                                    </div>
                                </div>
                                <div className="order-card-footer">
                                    <button className="btn-view-items" onClick={() => { setSelectedOrder(order); setShowItemsModal(true); }}>
                                        <Package size={16} /> View Items
                                    </button>
                                    {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                                        <>
                                            <button className="btn-track" onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }}>
                                                Track Order
                                            </button>
                                            {order.orderStatus === 'Pending' && (
                                                <button className="btn-cancel-order" onClick={() => handleCancelOrder(order._id)}>
                                                    Cancel Order
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showItemsModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Order Items</h3>
                            <button className="close-btn" onClick={() => setShowItemsModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {(selectedOrder.orderItems || []).map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <span>{item.plant?.plantName || 'Plant'}</span>
                                    <span>x{item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="order-item-total">
                                <strong>Total: ₹{selectedOrder.totalAmount}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTrackingModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content tracking-modal">
                        <div className="modal-header">
                            <h3>Track Order #{selectedOrder._id?.slice(-8)}</h3>
                            <button className="close-btn" onClick={() => setShowTrackingModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="tracking-steps">
                                {trackingSteps.map((step, index) => {
                                    const currentIndex = trackingSteps.indexOf(selectedOrder.orderStatus);
                                    const isCompleted = index <= currentIndex;
                                    return (
                                        <div key={step} className={`tracking-step ${isCompleted ? 'completed' : ''}`}>
                                            <div className="step-circle">{isCompleted ? <CheckCircle size={20} /> : <div className="empty-circle" />}</div>
                                            <span className="step-label">{step}</span>
                                            {index < trackingSteps.length - 1 && <div className={`step-line ${isCompleted ? 'completed' : ''}`} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
