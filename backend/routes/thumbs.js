// backend/routes/thumbs.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/authenticateToken');
const { ObjectId } = require('mongodb');

// 🔌 New: Import getIO to emit events
const { getIO } = require('../socket');

// ✅ GET thumbs counts for all comments on a movie
router.get('/:movieId/thumbs', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const objectId = new ObjectId(movieId);
    const comments = await Comment.find({ movie_id: objectId });

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

// PUT /api/thumbs/:id/like — like a comment
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

    // 🔌 New: Emit thumbsUpdated for movieId
    getIO().emit('thumbsUpdated', { movieId: comment.movie_id.toString() });

    res.json({ message: 'Comment liked', likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/thumbs/:id/unlike — unlike a comment (idempotent)
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

    const index = comment.likedBy.indexOf(userEmail);
    if (index !== -1) {
      comment.likedBy.splice(index, 1);
      comment.likes = comment.likedBy.length;
      await comment.save();

      // 🔌 New: Emit thumbsUpdated
      getIO().emit('thumbsUpdated', { movieId: comment.movie_id.toString() });

      return res.json({ message: 'Comment unliked', likes: comment.likes, dislikes: comment.dislikes });
    } else {
      return res.json({ message: 'User had not liked this comment', likes: comment.likes, dislikes: comment.dislikes });
    }
  } catch (err) {
    console.error('Error unliking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/thumbs/:id/dislike — dislike a comment
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

    // 🔌 New: Emit thumbsUpdated
    getIO().emit('thumbsUpdated', { movieId: comment.movie_id.toString() });

    res.json({ message: 'Comment disliked', dislikes: comment.dislikes, likes: comment.likes });
  } catch (err) {
    console.error('Error disliking comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/thumbs/:id/undislike — remove dislike from comment (idempotent)
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

    const index = comment.dislikedBy.indexOf(userEmail);
    if (index !== -1) {
      comment.dislikedBy.splice(index, 1);
      comment.dislikes = comment.dislikedBy.length;
      await comment.save();

      // 🔌 New: Emit thumbsUpdated
      getIO().emit('thumbsUpdated', { movieId: comment.movie_id.toString() });

      return res.json({ message: 'Dislike removed', dislikes: comment.dislikes, likes: comment.likes });
    } else {
      return res.json({ message: 'User had not disliked this comment', dislikes: comment.dislikes, likes: comment.likes });
    }
  } catch (err) {
    console.error('Error removing dislike:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
