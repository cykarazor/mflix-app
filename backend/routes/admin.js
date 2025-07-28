//backend/routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const User = require('../models/User');

// Middleware to ensure the user is authenticated and is an admin
const adminOnly = [authenticateToken, authorizeAdmin];

/**
 * GET /api/admin/users
 * Get all users (excluding passwords)
 */
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/users/:id
 * Get a single user by ID (excluding password)
 */
router.get('/users/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details (name, role, isActive)
 */
router.put('/users/:id', adminOnly, async (req, res) => {
  const { name, role, isActive } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/admin/users/:id/password
 * Reset user password
 */
router.put('/users/:id/password', adminOnly, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
