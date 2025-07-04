const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/authenticateToken'); // reuse from your auth.js

// GET comments by movie_id
router.get('/', async (req, res) => {
  const { movie_id } = req.query;
  if (!movie_id) {
    return res.status(400).json({ error: 'movie_id query parameter is required' });
  }

  try {
    const comments = await Comment.find({ movie_id }).sort({ date: -1 }).lean();
    res.json({ comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST a new comment (auth required)
router.post('/', authenticateToken, async (req, res) => {
  const { movie_id, name, email, text } = req.body;
  if (!movie_id || !name || !email || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newComment = new Comment({
      movie_id,
      name,
      email,
      text,
      date: new Date(),
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
