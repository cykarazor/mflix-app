const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment'); // Adjust path if needed

// Helper: Check valid ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get('/:movieId/thumbs', async (req, res) => {
  const movieId = req.params.movieId;

  if (!isValidObjectId(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  try {
    // Assuming your Comment schema stores movie_id as ObjectId, convert it
    const comments = await Comment.find({ movie_id: mongoose.Types.ObjectId(movieId) });

    let thumbsUp = 0;
    let thumbsDown = 0;

    comments.forEach(comment => {
      thumbsUp += (comment.likedBy?.length || 0);
      thumbsDown += (comment.dislikedBy?.length || 0);
    });

    res.json({ up: thumbsUp, down: thumbsDown });
  } catch (err) {
    console.error('Error fetching thumbs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
