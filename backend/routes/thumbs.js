const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Adjust path if needed


// ✅ GET movie comments Thumbs Up and Down Counts
// This endpoint retrieves the thumbs up and down counts for a specific movie's comments
router.get('/:movieId/thumbs', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    // Match using plain string
    const comments = await Comment.find({ movie_id: movieId });

    let thumbsUp = 0;
    let thumbsDown = 0;

    comments.forEach(comment => {
      thumbsUp += (comment.likedBy?.length || 0);
      thumbsDown += (comment.dislikedBy?.length || 0);
    });

    res.json({ up: thumbsUp, down: thumbsDown });
  } catch (err) {
    console.error('🔥 Thumbs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
