const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/authenticateToken');
const { ObjectId } = require('mongodb');  // <-- import from 'mongodb'

// GET comments by movie_id
router.get('/', async (req, res) => {
  const { movie_id } = req.query;
  if (!movie_id) {
    return res.status(400).json({ error: 'movie_id query parameter is required' });
  }

  try {
    const objectId = new ObjectId(movie_id);
    const comments = await Comment.find({ movie_id: objectId }).sort({ date: -1 }).lean();
    res.json({ comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a comment by comment ID (auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
  const commentId = req.params.id;
  const userEmail = req.user.email;  // assuming authenticateToken attaches user info here

  if (!ObjectId.isValid(commentId)) {
  return res.status(400).json({ error: 'Invalid comment ID' });
}

  try {
    // Find the comment by id
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the logged-in user owns the comment
    if (comment.email !== userEmail) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new comment (auth required)
router.post('/', authenticateToken, async (req, res) => {
  const { movie_id, name, email, text } = req.body;
  if (!movie_id || !name || !email || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const objectId = new ObjectId(movie_id);
    const newComment = new Comment({
      movie_id: objectId,
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
