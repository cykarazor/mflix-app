// ✅ routes/movies.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const movieController = require('../controllers/movieController');
const { connection } = require('../db'); // Optional: or pass from server.js

// ✅ GET thumbs up/down
router.get('/:movieId/thumbs', commentController.getThumbs);

// ✅ GET all movies (pass db from server.js via middleware)
router.get('/', async (req, res) => {
  await movieController.getMovies(req, res, connection.db);
});

// ✅ GET movie by ID
router.get('/:id', async (req, res) => {
  await movieController.getMovieById(req, res, connection.db);
});

// ✅ UPDATE movie by ID
router.put('/:id', async (req, res) => {
  await movieController.updateMovie(req, res, connection.db);
});

module.exports = router;
