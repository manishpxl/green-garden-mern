import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Generic Configs
import PrivateRoute from './Components/PrivateRoute';
import ErrorPage from './Components/ErrorPage';

// Auth & Public Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import HomePage from './Components/HomePage';

// Admin Components
import AdminNavbar from './AdminComponents/AdminNavbar';
import Dashboard from './AdminComponents/Dashboard';
import AddPlant from './AdminComponents/AddPlant';
import ViewPlant from './AdminComponents/ViewPlant';
import OrdersPlaced from './AdminComponents/OrdersPlaced';
import ViewReviews from './AdminComponents/ViewReviews';

// User Components
import UserNavbar from './UserComponents/UserNavbar';
import UserViewPlant from './UserComponents/UserViewPlant';
import AddReview from './UserComponents/AddReview';
import MyReviews from './UserComponents/MyReviews';
import Checkout from './UserComponents/Checkout';
import MyOrders from './UserComponents/MyOrders';

const App = () => {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>} />
                <Route path="/admin/add-plant" element={<PrivateRoute role="admin"><AddPlant /></PrivateRoute>} />
                <Route path="/admin/edit-plant/:id" element={<PrivateRoute role="admin"><AddPlant /></PrivateRoute>} />
                <Route path="/admin/view-plants" element={<PrivateRoute role="admin"><ViewPlant /></PrivateRoute>} />
                <Route path="/admin/orders" element={<PrivateRoute role="admin"><OrdersPlaced /></PrivateRoute>} />
                <Route path="/admin/reviews" element={<PrivateRoute role="admin"><ViewReviews /></PrivateRoute>} />

                {/* User Routes */}
                <Route path="/user/home" element={<PrivateRoute role="user"><HomePage /></PrivateRoute>} />
                <Route path="/user/view-plants" element={<PrivateRoute role="user"><UserViewPlant /></PrivateRoute>} />
                <Route path="/user/add-review/:plantId" element={<PrivateRoute role="user"><AddReview /></PrivateRoute>} />
                <Route path="/user/my-reviews" element={<PrivateRoute role="user"><MyReviews /></PrivateRoute>} />
                <Route path="/user/checkout" element={<PrivateRoute role="user"><Checkout /></PrivateRoute>} />
                <Route path="/user/my-orders" element={<PrivateRoute role="user"><MyOrders /></PrivateRoute>} />

                {/* Fallback Error Route */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
