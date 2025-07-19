// ✅ routes/movies.js
const express = require('express');
const movieController = require('../controllers/movieController');
const commentController = require('../controllers/commentController');

module.exports = function(connection) {
  const router = express.Router();

  // ✅ GET thumbs up/down
  router.get('/:movieId/thumbs', commentController.getThumbs);

  // ✅ GET all movies with search/pagination/sort
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

  return router;
};
