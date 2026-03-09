import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import { Menu, X } from 'lucide-react';
import './AdminNavbar.css';

const AdminNavbar = () => {

    const { userName, role } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

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

    const closeMenu = () => {
        setMobileMenu(false);
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="top-navbar">

                <div className="navbar-brand-text">
                    GreenGarden
                </div>

                {/* Hamburger */}
                <div className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
                    {mobileMenu ? <X size={26} /> : <Menu size={26} />}
                </div>

                {/* MENU */}
                <div className={`navbar-right-section ${mobileMenu ? "open" : ""}`}>

                    <div className="user-badge">
                        {userName || 'Admin'} / {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Admin'}
                    </div>

                    <div className="navbar-nav-links">

                        <NavLink to="/admin/dashboard" className="nav-link" onClick={closeMenu}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/admin/view-plants" className="nav-link" onClick={closeMenu}>
                            View Plants
                        </NavLink>

                        <NavLink to="/admin/add-plant" className="nav-link" onClick={closeMenu}>
                            Add Plant
                        </NavLink>

                        <NavLink to="/admin/orders" className="nav-link" onClick={closeMenu}>
                            Orders
                        </NavLink>

                        <NavLink to="/admin/reviews" className="nav-link" onClick={closeMenu}>
                            Reviews
                        </NavLink>

                    </div>

                    <button className="nav-logout-btn" onClick={handleLogoutClick}>
                        Logout
                    </button>

                </div>

            </nav>

            {/* BACKDROP FOR MOBILE MENU */}
            {mobileMenu && (
                <div className="menu-backdrop" onClick={() => setMobileMenu(false)}></div>
            )}

            {/* LOGOUT MODAL */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">

                        <p>Are you sure you want to logout?</p>

                        <div className="logout-modal-actions">

                            <button className="btn-confirm-logout" onClick={confirmLogout}>
                                Yes Logout
                            </button>

                            <button className="btn-cancel-logout" onClick={cancelLogout}>
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default AdminNavbar;