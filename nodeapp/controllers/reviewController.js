const Review = require('../models/review');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user').populate('plant');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user').populate('plant');
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewsByUserId = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.userId }).populate('user').populate('plant');
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this user" });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewsByPlantId = async (req, res) => {
    try {
        const reviews = await Review.find({ plant: req.params.plantId }).populate('user').populate('plant');
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this plant" });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        console.log("Review submission request received:", req.body);
        const newReview = await Review.create(req.body);
        res.status(201).json({ message: "Review generated successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Successfully updated review", review: updatedReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Successfully deleted review", review: deletedReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByUserId,
    getReviewsByPlantId,
    addReview,
    updateReview,
    deleteReview
};
