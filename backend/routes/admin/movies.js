// backend/routes/admin/movies.js
const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../../middleware/auth');
const Movie = require('../../models/Movie');

// GET /api/admin/movies?countOnly=true
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (req.query.countOnly === 'true') {
      const count = await Movie.countDocuments();
      return res.json({ count });
    }

    // You can extend this later for full movie list with pagination
    const movies = await Movie.find().limit(10);
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
