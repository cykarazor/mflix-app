import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditMovieForm from './EditMovieForm';

export default function EditMovieModal({ editMovieId, onClose, onUpdated }) {
  return (
    <Dialog open={!!editMovieId} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Movie Details</DialogTitle>
      <DialogContent dividers>
        {editMovieId && (
          <EditMovieForm
            movieId={editMovieId}
            onClose={onClose}
            onUpdated={(data) => {
              onUpdated(data);
              onClose();
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
