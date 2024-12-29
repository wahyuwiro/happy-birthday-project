import React, { useState } from 'react';
import { Alert, Snackbar, Typography, SnackbarCloseReason } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: "success" | "info" | "warning" | "error";
}

export default function CustomSnackbar({
  open,
  message,
  severity = "info",
}: CustomSnackbarProps) {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(open);

  // Handle closing the snackbar
  const handleClose = (
    event: React.SyntheticEvent | Event, // Explicit type for event
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={severity} icon={false} onClose={handleClose}>
        <Typography
          component="p"
          variant="body1"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </Alert>
    </Snackbar>
  );
}
