const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/addUser', userController.addUser);
router.post('/getUserByEmailAndPassword', userController.getUserByEmailAndPassword);

module.exports = router;
