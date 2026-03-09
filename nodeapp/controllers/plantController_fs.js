const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'plantsData.json');
let plantsData = [];

// Reading Data from JSON File
if (fs.existsSync(dataFilePath)) {
    try {
        const rawData = fs.readFileSync(dataFilePath, 'utf-8');
        if (rawData) {
            plantsData = JSON.parse(rawData);
        }
    } catch (err) {
        console.error("Error reading plantsData.json:", err);
    }
}

const savePlantsData = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(plantsData, null, 2));
};

const addPlant_fs = (req, res) => {
    try {
        const { plantName, description, price, stockQuantity, category, coverImage } = req.body;

        // Check if plant already exists
        const existingPlant = plantsData.find(plant => plant.plantName === plantName);
        if (existingPlant) {
            return res.status(400).json({ error: true, message: 'Plant already exists' });
        }

        const newPlant = {
            id: Date.now().toString(),
            plantName,
            description,
            price,
            stockQuantity,
            category,
            coverImage
        };

        plantsData.push(newPlant);
        savePlantsData();

        return res.status(201).json({ error: false, message: 'Plant Added Successfully', data: newPlant });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllPlants_fs = (req, res) => {
    try {
        return res.status(200).json({ error: false, message: 'All Plants found successfully', data: plantsData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPlantById_fs = (req, res) => {
    try {
        const { id } = req.params;
        const plant = plantsData.find(p => p.id === id);

        if (plant) {
            return res.status(200).json({ error: false, message: 'Plant found successfully', data: plant });
        } else {
            return res.status(404).json({ error: true, message: `No plant found with ID ${id}` });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deletePlantById_fs = (req, res) => {
    try {
        const { id } = req.params;
        const plantIndex = plantsData.findIndex(p => p.id === id);

        if (plantIndex !== -1) {
            const deletedPlant = plantsData.splice(plantIndex, 1)[0];
            savePlantsData();
            return res.status(200).json({ error: false, message: 'Plant Deleted Successfully', data: deletedPlant });
        } else {
            return res.status(404).json({ error: true, message: `No plant found with ID ${id}` });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPlant_fs,
    getAllPlants_fs,
    getPlantById_fs,
    deletePlantById_fs
};
