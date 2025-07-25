import { useState, useEffect } from 'react'; // 🆕 Added useEffect for snackbar test
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { useUser } from './UserContext';
import axios from 'axios';

export default function CommentFormModal({ open, onClose, movieId, onCommentAdded, openSnack }) {
  const { user } = useUser();
  const token = user?.token;

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(''); // Commented out, replaced by snackbar

  // 🐞 Debug: Log if openSnack is passed properly
  //console.log('✅ openSnack received from MovieComments:', typeof openSnack);

  // ✅ Optional: Test that openSnack works on open (for debugging only)
  useEffect(() => {
    if (open && typeof openSnack !== 'function') {
      console.warn('⚠️ openSnack is not a function or not passed down properly.');
    }
  }, [open, openSnack]);

  // Safely close modal without triggering aria-hidden warnings
  const handleCloseSafely = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Delay a tiny bit to let blur settle before closing the modal
      requestAnimationFrame(() => {
      setTimeout(() => {
        onClose();
      }, 100); // combine both if needed
    });
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      // setError('Comment cannot be empty');
      openSnack?.('Comment cannot be empty', 'error'); // ✅ Use optional chaining to avoid crash if undefined
      return;
    }

    setLoading(true);
    // setError(''); // clear error state not needed now

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/comments`,
        {
          movie_id: movieId,
          text,
          name: user.name,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log('✅ Comment submitted successfully');
        setText('');

        if (typeof onCommentAdded === 'function') {
          console.log('🔄 Fetching updated comments...');
          await onCommentAdded();
          console.log('✅ Comments updated successfully');
        }

        // ✅ Show success via snackbar
        openSnack?.('Comment submitted successfully!', 'success');

        console.log('🔐 Closing modal now');
        handleCloseSafely();
      } else {
        // setError('Failed to submit comment (unexpected response)');
        openSnack?.('Failed to submit comment (unexpected response)', 'error'); // ✅ Centralized snackbar
        console.error('Unexpected response:', response);
      }
    } catch (err) {
      console.error('❌ Submit comment error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        openSnack?.(`Failed: ${err.response.data.error || 'Server error'}`, 'error'); // ✅ Centralized
      } else if (err.request) {
        console.error('No response received:', err.request);
        openSnack?.('No response from server', 'error'); // ✅
      } else {
        console.error('Error message:', err.message);
        openSnack?.(`Error: ${err.message}`, 'error'); // ✅
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseSafely} maxWidth="sm" fullWidth>
      <DialogTitle>Add a Comment</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Your Comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
        />
        {/* {error && <Typography color="error">{error}</Typography>} */}
        {/* Removed local error display in favor of centralized snackbar */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSafely} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
