import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import { CartContext } from '../CartContext';
import { ShoppingCart, X, Menu, Leaf } from 'lucide-react';
import './UserNavbar.css';

const UserNavbar = () => {
    const { userName, role } = useSelector((state) => state.user);
    const { cart, clearCart, getCartTotal } = useContext(CartContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setMobileMenuOpen(false);
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
        setMobileMenuOpen(false);
        navigate('/user/checkout');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const goToPlants = () => {
        setIsCartOpen(false);
        setMobileMenuOpen(false);
        navigate('/user/view-plants');
    };

    return (
        <>
            <nav className="top-navbar">
                <div className="navbar-brand-text">
                    <Leaf size={20} className="brand-icon" />
                    <span>GreenGarden</span>
                </div>

                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </div>

                <div className={`navbar-right-section ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="user-badge">
                        {userName || 'User'} / {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}
                    </div>

                    <div className="navbar-nav-links">
                        <NavLink
                            to="/user/home"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/user/view-plants"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={closeMobileMenu}
                        >
                            Plant
                        </NavLink>

                        <NavLink
                            to="/user/my-reviews"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={closeMobileMenu}
                        >
                            Review
                        </NavLink>

                        <NavLink
                            to="/user/my-orders"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={closeMobileMenu}
                        >
                            My Orders
                        </NavLink>
                    </div>

                    <button
                        className="nav-cart-btn"
                        onClick={() => {
                            setIsCartOpen(!isCartOpen);
                            setMobileMenuOpen(false);
                        }}
                    >
                        <ShoppingCart className="cart-icon-simple" size={20} />
                        {cartItemsCount > 0 && (
                            <span className="cart-badge-dot">{cartItemsCount}</span>
                        )}
                    </button>

                    <button className="nav-logout-btn" onClick={handleLogoutClick}>
                        Logout
                    </button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="menu-backdrop" onClick={closeMobileMenu}></div>
            )}

            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-confirm-logout" onClick={confirmLogout}>
                                Yes, Logout
                            </button>
                            <button className="btn-cancel-logout" onClick={cancelLogout}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <ShoppingCart size={48} color="#bdbdbd" />
                            <p>Your cart is empty.</p>
                            <button className="continue-shopping" onClick={goToPlants}>
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
                            <button className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isCartOpen && (
                <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}></div>
            )}
        </>
    );
};

export default UserNavbar;