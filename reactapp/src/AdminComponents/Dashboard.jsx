import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import { Activity, Package, CheckCircle, Leaf } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPlants: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalReviews: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const plantsRes = await axios.get(`${apiConfig.baseUrl}/plants`);
            const ordersRes = await axios.get(`${apiConfig.baseUrl}/orders`);
            const reviewsRes = await axios.get(`${apiConfig.baseUrl}/reviews`);

            const plantsCount = plantsRes.data.length;
            const pendingCount = ordersRes.data.filter(o => o.orderStatus === 'Pending').length;
            const completedCount = ordersRes.data.filter(o => o.orderStatus === 'Delivered').length;
            const reviewsCount = reviewsRes.data.length;

            setStats({
                totalPlants: plantsCount,
                pendingOrders: pendingCount,
                completedOrders: completedCount,
                totalReviews: reviewsCount
            });
        } catch (error) {
            console.error("Error fetching stats", error);
            toast.error("Failed to load dashboard statistics.");
        }
    };

    return (
        <div className="dashboard-page">
            <AdminNavbar />
            <div className="dashboard-container">
                <div className="dashboard-header-section">
                    <h2>Admin Dashboard</h2>
                    <p>Welcome to the Green Garden Admin Panel.</p>
                </div>

                <div className="dashboard-banner">
                    {/* Fallback pattern if image is missing */}
                    <div className="banner-placeholder">
                        <img src="/images/banner.jpg" alt="Garden Banner" className="banner-img" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                </div>

                <div className="dashboard-stats-grid">
                    <div className="stat-card stat-blue">
                        <div className="stat-info">
                            <h3>{stats.totalPlants}</h3>
                            <p>Total Plants</p>
                        </div>
                        <div className="stat-icon">
                            <Leaf size={32} />
                        </div>
                    </div>

                    <div className="stat-card stat-orange">
                        <div className="stat-info">
                            <h3>{stats.pendingOrders}</h3>
                            <p>Pending Orders</p>
                        </div>
                        <div className="stat-icon">
                            <Activity size={32} />
                        </div>
                    </div>

                    <div className="stat-card stat-purple">
                        <div className="stat-info">
                            <h3>{stats.completedOrders}</h3>
                            <p>Completed Orders</p>
                        </div>
                        <div className="stat-icon">
                            <CheckCircle size={32} />
                        </div>
                    </div>

                    <div className="stat-card stat-green">
                        <div className="stat-info">
                            <h3>{stats.totalReviews}</h3>
                            <p>Total Reviews</p>
                        </div>
                        <div className="stat-icon">
                            <Package size={32} />
                        </div>
                    </div>
                </div>

                <div className="admin-footer-contact">
                    <p>Contact us: info@greengarden.com | +1 234 567 8900</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
