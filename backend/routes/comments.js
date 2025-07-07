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

// PUT /api/comments/:id/like — like a comment
router.put('/:id/like', authenticateToken, async (req, res) => {
  const commentId = req.params.id;
  const userEmail = req.user.email;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.likedBy.includes(userEmail)) {
      return res.status(400).json({ error: 'You have already liked this comment' });
    }

    // Remove dislike if exists
    if (comment.dislikedBy.includes(userEmail)) {
      comment.dislikedBy = comment.dislikedBy.filter(email => email !== userEmail);
      comment.dislikes = comment.dislikedBy.length;
    }

    comment.likedBy.push(userEmail);
    comment.likes = comment.likedBy.length;

    await comment.save();

    res.json({ message: 'Comment liked', likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/comments/:id/unlike — unlike a comment
router.put('/:id/unlike', authenticateToken, async (req, res) => {
  const commentId = req.params.id;
  const userEmail = req.user.email;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (!comment.likedBy.includes(userEmail)) {
      return res.status(400).json({ error: 'You have not liked this comment yet' });
    }

    comment.likedBy = comment.likedBy.filter(email => email !== userEmail);
    comment.likes = comment.likedBy.length;

    await comment.save();

    res.json({ message: 'Comment unliked', likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    console.error('Error unliking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/comments/:id/dislike — dislike a comment
router.put('/:id/dislike', authenticateToken, async (req, res) => {
  const commentId = req.params.id;
  const userEmail = req.user.email;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.dislikedBy.includes(userEmail)) {
      return res.status(400).json({ error: 'You have already disliked this comment' });
    }

    // Remove like if exists
    if (comment.likedBy.includes(userEmail)) {
      comment.likedBy = comment.likedBy.filter(email => email !== userEmail);
      comment.likes = comment.likedBy.length;
    }

    comment.dislikedBy.push(userEmail);
    comment.dislikes = comment.dislikedBy.length;

    await comment.save();

    res.json({ message: 'Comment disliked', dislikes: comment.dislikes, likes: comment.likes });
  } catch (err) {
    console.error('Error disliking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/comments/:id/undislike — remove dislike from comment
router.put('/:id/undislike', authenticateToken, async (req, res) => {
  const commentId = req.params.id;
  const userEmail = req.user.email;

  if (!ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (!comment.dislikedBy.includes(userEmail)) {
      return res.status(400).json({ error: 'You have not disliked this comment yet' });
    }

    comment.dislikedBy = comment.dislikedBy.filter(email => email !== userEmail);
    comment.dislikes = comment.dislikedBy.length;

    await comment.save();

    res.json({ message: 'Dislike removed', dislikes: comment.dislikes, likes: comment.likes });
  } catch (err) {
    console.error('Error removing dislike:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
