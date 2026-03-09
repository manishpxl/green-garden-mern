import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import { CartContext } from '../CartContext';
import { ShoppingCart, X } from 'lucide-react';
import './UserNavbar.css';

const UserNavbar = () => {
    const { userName, role } = useSelector((state) => state.user);
    const { cart, clearCart, getCartTotal } = useContext(CartContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        dispatch(clearUserInfo());
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/user/checkout');
    };

    return (
        <>
            <nav className="top-navbar">
                <div className="navbar-brand-text">
                    GreenGarden
                </div>

                <div className="navbar-right-section">
                    <div className="user-badge">
                        {userName || 'User'} / {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}
                    </div>

                    <div className="navbar-nav-links">
                        <NavLink to="/user/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Home
                        </NavLink>
                        <NavLink to="/user/view-plants" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Plant
                        </NavLink>
                        <NavLink to="/user/my-reviews" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Review
                        </NavLink>
                        <NavLink to="/user/my-orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            My Orders
                        </NavLink>
                    </div>

                    <button className="nav-cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                        <ShoppingCart className="cart-icon-simple" size={20} />
                        {cartItemsCount > 0 && <span className="cart-badge-dot">{cartItemsCount}</span>}
                    </button>

                    <button className="nav-logout-btn" onClick={handleLogoutClick}>
                        Logout
                    </button>
                </div>
            </nav>

            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-confirm-logout" onClick={confirmLogout}>Yes, Logout</button>
                            <button className="btn-cancel-logout" onClick={cancelLogout}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Overlay */}
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart</h3>
                    <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart size={48} color="#ccc" />
                            <p>Your cart is empty.</p>
                            <button className="continue-shopping" onClick={() => { setIsCartOpen(false); navigate('/user/view-plants'); }}>
                                Browse Plants
                            </button>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div className="cart-item" key={index}>
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p className="qty">Qty: {item.quantity}</p>
                                        <p className="price">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                        </div>
                    </div>
                )}
            </div>
            {isCartOpen && <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}></div>}
        </>
    );
};

export default UserNavbar;
