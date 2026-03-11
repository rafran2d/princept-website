const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Routes publiques
router.post('/login', AuthController.login);

// Routes protégées
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/verify', authMiddleware, AuthController.verify);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.post('/change-password', authMiddleware, AuthController.changePassword);
router.post('/update-profile', authMiddleware, AuthController.updateProfile);

module.exports = router;
