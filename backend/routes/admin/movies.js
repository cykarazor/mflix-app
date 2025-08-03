// backend/routes/admin/movies.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const authorizeAdmin = require('../../middleware/authorizeAdmin');
const Movie = require('../../models/Movie');

// GET /api/admin/movies?countOnly=true&page=0&pageSize=10&search=foo&year=2020
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    if (req.query.countOnly === 'true') {
      const count = await Movie.countDocuments();
      return res.json({ count });
    }

    const page = parseInt(req.query.page, 10) || 0; // zero-based page index
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    // Build filter object based on optional search and year filters
    const filter = {};

    if (req.query.search) {
      // Case-insensitive search on title, directors, or writers fields
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { directors: searchRegex },
        { writers: searchRegex },
      ];
    }

    if (req.query.year) {
      filter.year = parseInt(req.query.year, 10);
    }

    // Count total documents matching filter
    const totalCount = await Movie.countDocuments(filter);

    // Fetch paginated results
    const movies = await Movie.find(filter)
      .skip(page * pageSize)
      .limit(pageSize)
      .sort({ year: -1, title: 1 }) // example sort: newest year first, then title ascending
      .exec();

    res.json({ movies, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
