// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const SampleUser = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await SampleUser.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const newUser = new SampleUser({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SampleUser.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid Email' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid Password' });

    // ✅ Save old login before updating
    const previousLogin = user.lastLogin;

    // ✅ Update with new login time
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        lastLogin: previousLogin || null,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: previousLogin || null,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    const user = await SampleUser.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await user.comparePassword(oldPassword);
    if (!match) return res.status(401).json({ error: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
