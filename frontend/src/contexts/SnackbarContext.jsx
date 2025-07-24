import { createContext, useState, useContext, useCallback } from 'react';
import SnackbarDisplay from '../components/SnackbarDisplay';

// Create Context for Snackbar
const SnackbarContext = createContext();

// Provider component
export function SnackbarProvider({ children }) {
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info', // info, success, warning, error
  });

  // Open snackbar with message and optional severity
  const openSnack = useCallback((message, severity = 'info') => {
    setSnack({ open: true, message, severity });
  }, []);

  // Close snackbar handler, ignoring clickaway reason
  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ snack, openSnack, handleClose }}>
      {children}
      <SnackbarDisplay /> {/* <-- renders the visible snackbar */}
    </SnackbarContext.Provider>
  );
}

// Custom hook for easy access
export function useSnackbar() {
  return useContext(SnackbarContext);
}
