const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');

// Member login
router.post('/member/login', validateLogin, authController.memberLogin);

// Trainer login
router.post('/trainer/login', validateLogin, authController.trainerLogin);

// Owner login
router.post('/owner/login', validateLogin, authController.ownerLogin);

module.exports = router; 