import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import './ViewPlant.css';

const ViewPlant = () => {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchPlants = async () => {
        try {
            const res = await axios.get(`${apiConfig.baseUrl}/plants`);
            setPlants(res.data);
        } catch (err) {
            console.error("Error fetching plants:", err);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState(null);

    const handleDeleteClick = (plant) => {
        setPlantToDelete(plant);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!plantToDelete) return;
        try {
            await axios.delete(`${apiConfig.baseUrl}/plants/${plantToDelete._id}`);
            setPlants(plants.filter(p => p._id !== plantToDelete._id));
            toast.success("Plant deleted successfully.");
            setShowDeleteModal(false);
            setPlantToDelete(null);
        } catch (err) {
            toast.error("Error deleting plant. Please try again.");
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPlantToDelete(null);
    };

    const editPlant = (id) => {
        navigate(`/admin/edit-plant/${id}`);
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

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <div className="admin-page">
            <AdminNavbar />
            <div className="view-plant-container">
                <div className="header-actions">
                    <h2>Manage Plants</h2>
                    <div className="filters">
                        <div className="search-bar">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="category-filter">
                            <Filter className="filter-icon" size={20} />
                            <select
                                value={filterCategory}
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">All Categories</option>
                                <option value="Succulent">Succulent</option>
                                <option value="Flowering">Flowering</option>
                                <option value="Foliage">Foliage</option>
                                <option value="Bonsai">Bonsai</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="plant-grid">
                    {currentPlants.map(plant => (
                        <div className="plant-card" key={plant._id}>
                            <div className="plant-img-container">
                                <img src={plant.coverImage || 'https://via.placeholder.com/150/e5ecd6/2e7d32?text=Plant'} alt={plant.plantName} />
                                <span className="category-badge">{plant.category}</span>
                            </div>
                            <div className="plant-info">
                                <h3>{plant.plantName}</h3>
                                <p className="price">₹{plant.price}</p>
                                <p className="stock">Stock: {plant.stockQuantity}</p>
                                <p className="desc">{plant.description}</p>

                                <div className="card-actions">
                                    <button className="edit-btn" onClick={() => editPlant(plant._id)} title="Edit">
                                        <Pencil size={18} /> Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteClick(plant)} title="Delete">
                                        <Trash2 size={18} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {currentPlants.length === 0 && (
                        <div className="no-results">No plants found matching your criteria.</div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? 'active' : ''}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="logout-modal-overlay">
                        <div className="logout-modal-card">
                            <p>Are you sure you want to delete "{plantToDelete?.plantName}"? This action cannot be undone.</p>
                            <div className="logout-modal-actions">
                                <button className="btn-confirm-logout" style={{ backgroundColor: '#d32f2f' }} onClick={confirmDelete}>Yes, Delete</button>
                                <button className="btn-cancel-logout" onClick={cancelDelete}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewPlant;
