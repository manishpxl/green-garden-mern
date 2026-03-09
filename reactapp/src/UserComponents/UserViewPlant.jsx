import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, MessageSquare, Star, X } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import { CartContext } from '../CartContext';
import './UserViewPlant.css';

const UserViewPlant = () => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [plants, setPlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Reviews Modal
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [selectedPlantReviews, setSelectedPlantReviews] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const res = await axios.get(`${apiConfig.baseUrl}/plants`);
                setPlants(res.data);
            } catch (err) {
                console.error("Error fetching plants:", err);
            }
        };
        fetchPlants();
    }, []);

    const handleAddToCart = (plant) => {
        addToCart({
            plantId: plant._id,
            name: plant.plantName,
            price: plant.price,
            image: plant.coverImage
        }, 1);
        toast.success(`${plant.plantName} added to cart!`);
    };

    const handleWriteReview = (plantId) => {
        navigate(`/user/add-review/${plantId}`);
    };

    const openReviews = async (plant) => {
        setSelectedPlant(plant);
        try {
            const res = await axios.get(`${apiConfig.baseUrl}/reviews/plant/${plant._id}`);
            setSelectedPlantReviews(res.data);
        } catch (err) {
            setSelectedPlantReviews([]);
        }
        setShowReviewsModal(true);
    };

    // Filter & Search Logic
    const filteredPlants = plants.filter(plant => {
        const matchesSearch = plant.plantName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? plant.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlants = filteredPlants.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

    // Render Stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={14}
                fill={index < rating ? "#ffc107" : "none"}
                stroke={index < rating ? "#ffc107" : "#e0e0e0"}
            />
        ));
    };

    return (
        <div className="user-page">
            <UserNavbar />
            <div className="catalog-container">
                <div className="catalog-header">
                    <h2>Discover Our Plants</h2>
                    <div className="filters">
                        <div className="search-bar">
                            <Search className="search-icon" size={20} />
                            <input type="text" placeholder="Search plants..." value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        </div>
                        <div className="category-filter">
                            <Filter className="filter-icon" size={20} />
                            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
                                <option value="">All Categories</option>
                                <option value="Succulent">Succulent</option>
                                <option value="Flowering">Flowering</option>
                                <option value="Foliage">Foliage</option>
                                <option value="Bonsai">Bonsai</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="product-grid">
                    {currentPlants.map(plant => (
                        <div className="product-card" key={plant._id}>
                            <div className="product-img-wrapper">
                                <img src={plant.coverImage || 'https://via.placeholder.com/200/e5ecd6/2e7d32?text=Plant'} alt={plant.plantName} />
                                <span className={`stock-badge ${plant.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {plant.stockQuantity > 0 ? `In Stock (${plant.stockQuantity})` : 'Out of Stock'}
                                </span>
                                <span className="cat-badge">{plant.category}</span>
                            </div>
                            <div className="product-details">
                                <div className="product-title-row">
                                    <h3>{plant.plantName}</h3>
                                    <span className="price">₹{plant.price}</span>
                                </div>
                                <p className="product-desc">{plant.description}</p>
                                <div className="product-actions">
                                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(plant)} disabled={plant.stockQuantity === 0}>
                                        <ShoppingCart size={18} /> {plant.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                    <div className="review-actions">
                                        <button className="view-reviews-btn" onClick={() => openReviews(plant)}>
                                            <MessageSquare size={16} /> View Reviews
                                        </button>
                                        <button className="write-review-btn" onClick={() => handleWriteReview(plant._id)}>
                                            Write Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentPlants.length === 0 && (
                        <div className="no-products">No plants match your search. Try different keywords or categories.</div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                    </div>
                )}
            </div>

            {/* Reviews Modal */}
            {showReviewsModal && selectedPlant && (
                <div className="modal-overlay">
                    <div className="modal-content reviews-modal">
                        <div className="modal-header">
                            <h3>Reviews for {selectedPlant.plantName}</h3>
                            <button className="close-btn" onClick={() => setShowReviewsModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedPlantReviews.length === 0 ? (
                                <p className="no-reviews-msg">No reviews yet for this plant. Be the first to review!</p>
                            ) : (
                                <div className="modal-review-list">
                                    {selectedPlantReviews.map(review => (
                                        <div className="modal-review-item" key={review._id}>
                                            <div className="mr-header">
                                                <div className="mr-user">
                                                    <span className="mr-name">{review.user?.username || 'Anonymous'}</span>
                                                    <span className="mr-date">{new Date(review.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mr-rating">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <p className="mr-text">"{review.reviewText}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserViewPlant;
