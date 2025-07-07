// src/LikeDislikeButtons.jsx
import React, { useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';

export default function LikeDislikeButtons({ comment, token, userEmail, onUpdate }) {
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const [error, setError] = useState('');

  const likedBy = Array.isArray(comment.likedBy) ? comment.likedBy : [];
  const dislikedBy = Array.isArray(comment.dislikedBy) ? comment.dislikedBy : [];

  const hasLiked = likedBy.includes(userEmail);
  const hasDisliked = dislikedBy.includes(userEmail);


  // Handle Like click
  const handleLike = async () => {
    if (loadingLike || loadingDislike) return; // prevent multiple clicks
    setError('');

    try {
      setLoadingLike(true);
      if (hasLiked) {
        // Unlike
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/unlike`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Like
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // If disliked before, remove dislike
        if (hasDisliked) {
          await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/undislike`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      await onUpdate();
    } catch (err) {
      setError('Failed to update like status');
    } finally {
      setLoadingLike(false);
    }
  };

  // Handle Dislike click
  const handleDislike = async () => {
    if (loadingLike || loadingDislike) return;
    setError('');

    try {
      setLoadingDislike(true);
      if (hasDisliked) {
        // Remove dislike
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/undislike`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add dislike
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/dislike`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // If liked before, remove like
        if (hasLiked) {
          await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/comments/${comment._id}/unlike`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      await onUpdate();
    } catch (err) {
      setError('Failed to update dislike status');
    } finally {
      setLoadingDislike(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={handleLike}
        color={hasLiked ? 'primary' : 'default'}
        disabled={loadingLike || loadingDislike}
        size="small"
        aria-label="like"
      >
        <ThumbUpIcon />
      </IconButton>
      <Typography variant="caption">{comment.likes || 0}</Typography>

      <IconButton
        onClick={handleDislike}
        color={hasDisliked ? 'error' : 'default'}
        disabled={loadingLike || loadingDislike}
        size="small"
        aria-label="dislike"
      >
        <ThumbDownIcon />
      </IconButton>
      <Typography variant="caption">{comment.dislikes || 0}</Typography>

      {error && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
