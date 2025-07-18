const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SampleUser = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = require('../middleware/authenticateToken');


// ✅ REGISTER route
router.post('/register', async (req, res) => {
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
});

// ✅ LOGIN route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SampleUser.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid Email' });

    const match = await user.comparePassword(password); // ✅ Use model method
    if (!match) return res.status(401).json({ error: 'Invalid Password' });

    // ✅ Save old login before updating
    const previousLogin = user.lastLogin;
    
    // ✅ Update with new login time
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id,
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
        } 
      });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ CHANGE PASSWORD route
router.post('/change-password', authenticateToken, async (req, res) => {
  console.log("✅ Token decoded user:", req.user); // should show userId
  
  try {
    const { oldPassword, newPassword } = req.body;
    console.log("📥 Passwords received:", oldPassword, newPassword);

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    const user = await SampleUser.findById(req.user.userId);
    console.log("🔍 Found user:", user?.email);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await user.comparePassword(oldPassword);
    console.log("🔑 Password match result:", match);

    if (!match) return res.status(401).json({ error: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();

    console.log("✅ Password changed for user:", user.email);
    res.json({ message: '✅ Password changed successfully' });
  } catch (err) {
    console.error('❌ Change password error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//temp test
router.get('/test', (req, res) => {
  res.json({ message: '✅ /api/auth is working' });
});



module.exports = router;
