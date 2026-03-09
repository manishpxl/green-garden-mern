const Plant = require('../models/plant');

const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find({});
        res.status(200).json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }
        res.status(200).json(plant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPlant = async (req, res) => {
    try {
        const newPlant = await Plant.create(req.body);
        res.status(201).json({ message: "Successfully added plant", plant: newPlant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlant = async (req, res) => {
    try {
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) {
            return res.status(404).json({ message: "Plant not found" });
        }
        res.status(200).json({ message: "Successfully updated plant", plant: updatedPlant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlant = async (req, res) => {
    try {
        const deletedPlant = await Plant.findByIdAndDelete(req.params.id);
        if (!deletedPlant) {
            return res.status(404).json({ message: "Plant not found" });
        }
        res.status(200).json({ message: "Successfully deleted plant", plant: deletedPlant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPlants,
    getPlantById,
    addPlant,
    updatePlant,
    deletePlant
};
