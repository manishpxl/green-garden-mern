const express = require('express');
const router = express.Router();
const userController_fs = require('../controllers/userController_fs');

router.post('/register_fs', userController_fs.register_fs);
router.post('/login_fs', userController_fs.login_fs);
router.put('/resetPassword_fs', userController_fs.resetPassword_fs);
router.get('/getAllUsers_fs', userController_fs.getAllUsers_fs);

module.exports = router;
