import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const { userName, role } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

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

    return (
        <>
            <nav className="top-navbar">
                <div className="navbar-brand-text">
                    GreenGarden
                </div>

                <div className="navbar-right-section">
                    <div className="user-badge">
                        {userName || 'Admin'} / {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Admin'}
                    </div>

                    <div className="navbar-nav-links">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Home
                        </NavLink>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/view-plants" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            View Plants
                        </NavLink>
                        <NavLink to="/admin/add-plant" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Add Plant
                        </NavLink>
                        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Orders
                        </NavLink>
                        <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Reviews
                        </NavLink>
                    </div>

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
        </>
    );
};

export default AdminNavbar;
