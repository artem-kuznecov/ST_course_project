import { Alert, Snackbar } from '@mui/material';

export function SuccessSnack({isOpen, handleClose = Function.prototype, alert_text}) {
    return (
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={2000}
      >
        <Alert
          severity='success'
          sx={{ fontWeight: 'bold', fontFamily: 'Ubuntu' }}
        >{alert_text}</Alert>
      </Snackbar>
    )
  };

export function ErrorSnack({isOpen, handleClose = Function.prototype, alert_text}) {
    return (
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={2000}
      >
        <Alert
          severity='error'
          sx={{ fontWeight: 'bold', fontFamily: 'Ubuntu' }}
        >{alert_text}</Alert>
      </Snackbar>
    )
  }