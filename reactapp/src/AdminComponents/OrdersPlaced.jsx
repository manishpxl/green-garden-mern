import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { Search, Package, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import './OrdersPlaced.css';

const OrdersPlaced = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${apiConfig.baseUrl}/orders`);
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`${apiConfig.baseUrl}/orders/${orderId}`, { orderStatus: newStatus });
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Error updating order status.");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} color="green" />;
            case 'Pending': return <Clock size={16} color="orange" />;
            case 'Cancelled': return <XCircle size={16} color="red" />;
            default: return <Clock size={16} color="blue" />;
        }
    };

    const filteredOrders = orders.filter(order =>
        (order._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const openItemsModal = (order) => { setSelectedOrder(order); setShowItemsModal(true); };
    const openUserModal = (order) => { setSelectedOrder(order); setShowUserModal(true); };

    return (
        <div className="admin-page">
            <AdminNavbar />
            <div className="orders-container">
                <div className="orders-header">
                    <h2>Manage Orders</h2>
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search by Order ID or User..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                    </div>
                </div>

                <div className="orders-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order._id}>
                                    <td className="font-bold">{order._id?.slice(-8)}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>{order.user?.username || 'N/A'}</td>
                                    <td className="font-bold text-green">₹{order.totalAmount}</td>
                                    <td>
                                        <div className="status-cell">
                                            {getStatusIcon(order.orderStatus)}
                                            <select className={`status-select ${(order.orderStatus || '').toLowerCase()}`}
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" title="View Items" onClick={() => openItemsModal(order)}>
                                                <Package size={18} />
                                            </button>
                                            <button className="btn-icon" title="View User Info" onClick={() => openUserModal(order)}>
                                                <User size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {currentOrders.length === 0 && (
                                <tr><td colSpan="6" className="no-data">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                    </div>
                )}
            </div>

            {showItemsModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Order Items</h3>
                            <button className="close-btn" onClick={() => setShowItemsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <table className="items-table">
                                <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                                <tbody>
                                    {(selectedOrder.orderItems || []).map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.plant?.plantName || 'N/A'}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price}</td>
                                            <td>₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot><tr><td colSpan="3" align="right"><strong>Total:</strong></td><td><strong>₹{selectedOrder.totalAmount}</strong></td></tr></tfoot>
                            </table>
                            <div className="shipping-info">
                                <h4>Shipping Address:</h4>
                                <p>{selectedOrder.shippingAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showUserModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content user-modal">
                        <div className="modal-header">
                            <h3>Customer Profile</h3>
                            <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
                        </div>
                        <div className="modal-body user-details">
                            <div className="detail-row"><span className="label">Name:</span><span className="value">{selectedOrder.user?.username || 'N/A'}</span></div>
                            <div className="detail-row"><span className="label">Email:</span><span className="value">{selectedOrder.user?.email || 'N/A'}</span></div>
                            <div className="detail-row"><span className="label">Mobile:</span><span className="value">{selectedOrder.user?.mobileNumber || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPlaced;
