import React, { useEffect, useState, useContext } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from './UserContext'; // ✅
import CommentFormModal from './CommentFormModal'; // ✅ NEW

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function MovieComments({ movieId, token }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false); // ✅ NEW
  const [form, setForm] = useState({ text: '' }); // ✅ NEW

  const { user } = useContext(UserContext); // ✅

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments?movie_id=${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(res.data.comments || []);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    if (movieId && token) fetchComments();
  }, [movieId, token]);

  const handleOpen = () => setOpen(true); // ✅
  const handleClose = () => {
    setOpen(false);
    setForm({ text: '' });
  }; // ✅

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; // ✅

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/comments`,
        {
          movie_id: movieId,
          name: user.name,
          email: user.email,
          text: form.text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/comments?movie_id=${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments || []);
      handleClose();
    } catch (err) {
      console.error('Failed to submit comment', err);
      setError('Failed to submit comment');
    }
  }; // ✅

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {comments.length === 0 ? (
        <Typography>No comments available.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{comment.name}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      )}

      {user && (
        <>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpen}>
            Leave a Comment
          </Button>

          {/* ✅ Comment Form Modal */}
          <CommentFormModal
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
            form={form}
            onChange={handleChange}
          />
        </>
      )}
    </Box>
  );
}
