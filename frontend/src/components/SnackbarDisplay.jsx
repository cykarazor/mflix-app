// src/components/SnackbarDisplay.jsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useSnackbar } from '../contexts/SnackbarContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarDisplay() {
  const { snack, handleClose } = useSnackbar();

  return (
    <Snackbar
      open={snack.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
        {snack.message}
      </Alert>
    </Snackbar>
  );
}
