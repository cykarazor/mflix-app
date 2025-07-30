const User = require('../models/User');

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'user' }); // Normal users only
    res.json({ count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
};

module.exports = {
  getUserCount,
};
