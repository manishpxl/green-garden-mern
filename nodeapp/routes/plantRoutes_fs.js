const express = require('express');
const router = express.Router();
const plantController_fs = require('../controllers/plantController_fs');

router.post('/addPlant_fs', plantController_fs.addPlant_fs);
router.get('/getAllPlants_fs', plantController_fs.getAllPlants_fs);
router.get('/getPlantById_fs/:id', plantController_fs.getPlantById_fs);
router.delete('/deletePlantById_fs/:id', plantController_fs.deletePlantById_fs);

module.exports = router;
