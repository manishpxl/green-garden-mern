import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';

const AddReview = () => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const userId = user.userId;

    const [plant, setPlant] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const res = await axios.get(`${apiConfig.baseUrl}/plants/${plantId}`);
                setPlant(res.data);
            } catch (err) {
                console.error("Error fetching plant:", err);
            }
        };
        fetchPlant();
    }, [plantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warning("Please select a rating.");
            return;
        }
        if (!reviewText.trim()) {
            toast.warning("Please write a review.");
            return;
        }

        try {
            await axios.post(`${apiConfig.baseUrl}/reviews`, {
                reviewText,
                rating,
                user: userId,
                plant: plantId
            });
            toast.success("Review submitted successfully!");
            navigate('/user/my-reviews');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review.");
        }
    };

    return (
        <div className="user-page">
            <UserNavbar />
            <div className="review-form-container">
                <h2>Write a Review</h2>
                <p className="subtitle">Share your thoughts with other customers</p>
                {plant && (
                    <div className="review-plant-info">
                        <img src={plant.coverImage || 'https://via.placeholder.com/80'} alt={plant.plantName} />
                        <div>
                            <h3>{plant.plantName}</h3>
                            <p>{plant.category} · ₹{plant.price}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="review-form">
                    <div className="rating-group">
                        <label>Your Rating</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(starVal => (
                                <Star
                                    key={starVal}
                                    size={32}
                                    className={`star-icon ${(hoverRating || rating) >= starVal ? 'filled' : ''}`}
                                    fill={(hoverRating || rating) >= starVal ? "#ffc107" : "none"}
                                    stroke={(hoverRating || rating) >= starVal ? "#ffc107" : "#ccc"}
                                    onMouseEnter={() => setHoverRating(starVal)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(starVal)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            rows="5"
                            placeholder="Share your experience with this plant..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/user/view-plants')}>Cancel</button>
                        <button type="submit" className="btn-submit">Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReview;
