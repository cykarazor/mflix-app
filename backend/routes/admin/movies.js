// backend/routes/admin/movies.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const authorizeAdmin = require('../../middleware/authorizeAdmin');
const Movie = require('../../models/Movie');

// GET /api/admin/movies with search and pagination
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // ✅ Handle countOnly before pagination
    if (req.query.countOnly === 'true') {
      const count = await Movie.countDocuments(); // or add filtering logic here if needed
      return res.json({ count });
    }

    // Pagination and search logic
    const page = parseInt(req.query.page, 10) || 0;       // zero-based page
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const search = req.query.search || '';
    const year = parseInt(req.query.year, 10);

    // Build MongoDB query object
    const query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i'); // case-insensitive search
      query.$or = [
        { title: regex },
        { plot: regex },
        { cast: { $in: [regex] } },
        { directors: { $in: [regex] } },
      ];
    }

    // 👇 Add year filter if provided
    if (!isNaN(year)) {
      query.year = year;
    }

    // Count total filtered documents
    const totalCount = await Movie.countDocuments(query);

    // Fetch filtered and paginated movies
    const movies = await Movie.find(query)
      .skip(page * pageSize)
      .limit(pageSize)
      .sort({ year: -1, title: 1 });

    res.json({ movies, totalCount });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/movies/years to get distinct years for filtering
router.get('/years', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Get distinct years from movies collection
    // If some movies don't have year but have `released` date, you can consider those too
    const yearsFromDB = await Movie.distinct('year');

    // Filter out invalid years or nulls, then sort descending
    const years = yearsFromDB
      .filter((y) => typeof y === 'number' && !isNaN(y))
      .sort((a, b) => b - a);

    res.json({ years });
  } catch (err) {
    console.error('Error fetching years:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
