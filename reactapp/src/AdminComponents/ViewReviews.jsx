import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { Search, Star, MessageSquare, Package, User, Trash2 } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import './ViewReviews.css';

const ViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    const [selectedReview, setSelectedReview] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${apiConfig.baseUrl}/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        try {
            await axios.delete(`${apiConfig.baseUrl}/reviews/${reviewToDelete._id}`);
            setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
            toast.success("Review deleted successfully.");
            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (err) {
            toast.error("Error deleting review.");
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    const openProductModal = (review) => { setSelectedReview(review); setShowProductModal(true); };
    const openUserModal = (review) => { setSelectedReview(review); setShowUserModal(true); };

    const filteredReviews = reviews.filter(review =>
        (review.reviewText || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star key={index} size={16} fill={index < rating ? "#ffc107" : "none"} stroke={index < rating ? "#ffc107" : "#e0e0e0"} />
        ));
    };

    return (
        <div className="admin-page">
            <AdminNavbar />
            <div className="reviews-container">
                <div className="orders-header">
                    <h2>Manage Reviews</h2>
                    <div className="filters review-filters">
                        <div className="search-bar">
                            <Search size={18} />
                            <input type="text" placeholder="Search reviews..." value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        </div>
                        <div className="sort-filter">
                            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}>
                                <option value="desc">Date: Newest to Oldest</option>
                                <option value="asc">Date: Oldest to Newest</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="reviews-list">
                    {currentReviews.map(review => (
                        <div className="review-card" key={review._id}>
                            <div className="review-header">
                                <div className="review-rating">{renderStars(review.rating)}</div>
                                <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                            </div>
                            <div className="review-body">
                                <MessageSquare className="quote-icon" size={24} />
                                <p className="review-text">"{review.reviewText}"</p>
                            </div>
                            <div className="review-footer">
                                <button className="btn-link" onClick={() => openProductModal(review)}>
                                    <Package size={16} /> View Product
                                </button>
                                <button className="btn-link" onClick={() => openUserModal(review)}>
                                    <User size={16} /> View User
                                </button>
                                <button className="btn-link text-red" onClick={() => handleDeleteClick(review)} style={{ color: '#d32f2f' }}>
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {currentReviews.length === 0 && (<div className="no-data">No reviews match your search.</div>)}
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

            {showProductModal && selectedReview && (
                <div className="modal-overlay">
                    <div className="modal-content product-modal">
                        <div className="modal-header">
                            <h3>Product Info</h3>
                            <button className="close-btn" onClick={() => setShowProductModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="product-modal-content">
                                <img src={selectedReview.plant?.coverImage || 'https://via.placeholder.com/150'} alt={selectedReview.plant?.plantName} className="modal-product-img" />
                                <div className="modal-product-details">
                                    <h4>{selectedReview.plant?.plantName || 'N/A'}</h4>
                                    <p className="category">{selectedReview.plant?.category}</p>
                                    <p className="price">₹{selectedReview.plant?.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showUserModal && selectedReview && (
                <div className="modal-overlay">
                    <div className="modal-content user-modal">
                        <div className="modal-header">
                            <h3>User Info</h3>
                            <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
                        </div>
                        <div className="modal-body user-details">
                            <div className="detail-row"><span className="label">Name:</span><span className="value">{selectedReview.user?.username || 'N/A'}</span></div>
                            <div className="detail-row"><span className="label">Email:</span><span className="value">{selectedReview.user?.email || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <p>Are you sure you want to delete this review? This action cannot be undone.</p>
                        <div className="logout-modal-actions">
                            <button className="btn-confirm-delete" style={{ backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }} onClick={confirmDelete}>Yes, Delete</button>
                            <button className="btn-cancel-delete" style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }} onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewReviews;
