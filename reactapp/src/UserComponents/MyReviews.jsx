import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, Trash2, Package, X } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import './MyReviews.css';

const MyReviews = () => {
    const user = useSelector(state => state.user);
    const userId = user.userId;
    const [reviews, setReviews] = useState([]);

    const [selectedReview, setSelectedReview] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${apiConfig.baseUrl}/reviews/user/${userId}`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setReviews([]);
            }
        };
        fetchReviews();
    }, [userId]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const handleDeleteClick = (reviewId) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        try {
            await axios.delete(`${apiConfig.baseUrl}/reviews/${reviewToDelete}`);
            setReviews(reviews.filter(r => r._id !== reviewToDelete));
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

    const openProductModal = (review) => {
        setSelectedReview(review);
        setShowProductModal(true);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star key={index} size={14} fill={index < rating ? "#ffc107" : "none"} stroke={index < rating ? "#ffc107" : "#e0e0e0"} />
        ));
    };

    return (
        <div className="user-page">
            <UserNavbar />
            <div className="my-reviews-container">
                <h2>My Reviews</h2>
                {reviews.length === 0 ? (
                    <div className="no-reviews">You haven't written any reviews yet.</div>
                ) : (
                    <div className="reviews-grid">
                        {reviews.map(review => (
                            <div className="review-card" key={review._id}>
                                <div className="review-header">
                                    <div className="review-rating">{renderStars(review.rating)}</div>
                                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                                </div>
                                <p className="review-text">"{review.reviewText}"</p>
                                <div className="review-footer">
                                    <button className="btn-view-product" onClick={() => openProductModal(review)}>
                                        <Package size={16} /> View Product
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDeleteClick(review._id)}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showProductModal && selectedReview && (
                <div className="modal-overlay">
                    <div className="modal-content product-modal">
                        <div className="modal-header">
                            <h3>Product Details</h3>
                            <button className="close-btn" onClick={() => setShowProductModal(false)}><X size={20} /></button>
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
            {showDeleteModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-card">
                        <p>Are you sure you want to delete this review? This action cannot be undone.</p>
                        <div className="logout-modal-actions">
                            <button className="btn-confirm-logout" style={{ backgroundColor: '#d32f2f' }} onClick={confirmDelete}>Yes, Delete</button>
                            <button className="btn-cancel-logout" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviews;
