import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../apiConfig';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import adminPlants from '../Assets/admin-plants.jpg';
import './AddPlant.css';

const AddPlant = () => {

    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [imageBase64, setImageBase64] = useState('');

    useEffect(() => {

        if (isEditMode) {

            const fetchPlant = async () => {
                try {

                    const res = await axios.get(`${apiConfig.baseUrl}/plants/${id}`);
                    const plant = res.data;

                    setValue('name', plant.plantName);
                    setValue('category', plant.category);
                    setValue('price', plant.price);
                    setValue('stock', plant.stockQuantity);
                    setValue('description', plant.description);

                    setImageBase64(plant.coverImage || '');

                } catch (err) {

                    console.error("Error fetching plant:", err);
                    toast.error("Failed to fetch plant details.");

                }
            };

            fetchPlant();
        }

    }, [id, isEditMode, setValue]);


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onloadend = () => {
                setImageBase64(reader.result);
            };

            reader.readAsDataURL(file);
        }

    };


    const onSubmit = async (data) => {

        if (!imageBase64 && !isEditMode) {
            toast.error("Image is required");
            return;
        }

        const payload = {
            plantName: data.name,
            description: data.description,
            price: Number(data.price),
            stockQuantity: Number(data.stock),
            category: data.category,
            coverImage: imageBase64
        };

        try {

            if (isEditMode) {

                await axios.put(`${apiConfig.baseUrl}/plants/${id}`, payload);
                toast.success('Plant updated successfully!');

            } else {

                await axios.post(`${apiConfig.baseUrl}/plants`, payload);
                toast.success('Plant added successfully!');

            }

            navigate('/admin/view-plants');

        } catch (err) {

            toast.error(err.response?.data?.message || 'Operation failed.');

        }
    };


    return (

        <div className="admin-page">

            <AdminNavbar />

            <div className="add-plant-wrapper">

                <div className="add-plant-layout">


                    {/* LEFT IMAGE */}

                    <div className="add-plant-image-col">
                        <img src={adminPlants} alt="Plants" />
                    </div>


                    {/* FORM */}

                    <div className="add-plant-form-col">

                        <div className="add-plant-form-card">

                            <h2>{isEditMode ? 'Edit Plant' : 'Add Plant'}</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="add-plant-form">


                                <div className="form-group-single">

                                    <label>Plant Name</label>

                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                    />

                                    {errors.name && (
                                        <span className="error-text">
                                            {errors.name.message}
                                        </span>
                                    )}

                                </div>



                                <div className="form-group-single">

                                    <label>Description</label>

                                    <textarea
                                        rows="3"
                                        {...register('description', { required: 'Description is required' })}
                                    ></textarea>

                                    {errors.description && (
                                        <span className="error-text">
                                            {errors.description.message}
                                        </span>
                                    )}

                                </div>



                                <div className="form-row">

                                    <div className="form-group-half">

                                        <label>Stock Available</label>

                                        <input
                                            type="number"
                                            {...register('stock', {
                                                required: 'Stock is required',
                                                min: { value: 0, message: "Cannot be negative" }
                                            })}
                                        />

                                        {errors.stock && (
                                            <span className="error-text">
                                                {errors.stock.message}
                                            </span>
                                        )}

                                    </div>



                                    <div className="form-group-half">

                                        <label>Price</label>

                                        <input
                                            type="number"
                                            {...register('price', {
                                                required: 'Price is required',
                                                min: { value: 1, message: "Must be > 0" }
                                            })}
                                        />

                                        {errors.price && (
                                            <span className="error-text">
                                                {errors.price.message}
                                            </span>
                                        )}

                                    </div>

                                </div>



                                <div className="form-group-single">

                                    <label>Category</label>

                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                    >

                                        <option value="">Select Category</option>
                                        <option value="Succulent">Succulent</option>
                                        <option value="Flowering">Flowering</option>
                                        <option value="Foliage">Foliage</option>
                                        <option value="Bonsai">Bonsai</option>

                                    </select>

                                    {errors.category && (
                                        <span className="error-text">
                                            {errors.category.message}
                                        </span>
                                    )}

                                </div>



                                <div className="form-group-single">

                                    <label>Plant Image</label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    {imageBase64 && (

                                        <div className="img-preview">
                                            <img src={imageBase64} alt="Preview" />
                                        </div>

                                    )}

                                </div>



                                <div className="add-plant-actions">

                                    <button type="submit" className="btn-add-submit">
                                        {isEditMode ? 'Update Plant' : 'Add Plant'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-add-cancel"
                                        onClick={() => navigate('/admin/view-plants')}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AddPlant;