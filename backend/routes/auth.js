const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SampleUser = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token from Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user; // Attach user payload to request
    next();
  });
};

// REGISTER: name, email, password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await SampleUser.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // ❌ Do NOT hash here. Let the pre-save hook handle it.
    const newUser = new SampleUser({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN: by email
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SampleUser.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid Email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid Password' });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CHANGE PASSWORD: Requires auth
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    // Find user from the token
    const user = await SampleUser.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if old password is correct
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ error: 'Old password is incorrect' });

    // Update password (mongoose pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: '✅ Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
