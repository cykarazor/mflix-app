const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Change Password (protected)
router.post('/change-password', authenticateToken, authController.changePassword);

//temp test
router.get('/test', (req, res) => {
  res.json({ message: '✅ /api/auth is working' });
});

module.exports = router;
