// backend/routes/admin/movies.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const authorizeAdmin = require('../../middleware/authorizeAdmin');
const Movie = require('../../models/Movie');

// GET /api/admin/movies?page=0&pageSize=10
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 0;         // 0-based index
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    // Count total movies
    const totalCount = await Movie.countDocuments();

    // Fetch paginated movies
    const movies = await Movie.find()
      .skip(page * pageSize)
      .limit(pageSize)
      .sort({ year: -1, title: 1 });  // Optional sort

    res.json({ movies, totalCount });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
