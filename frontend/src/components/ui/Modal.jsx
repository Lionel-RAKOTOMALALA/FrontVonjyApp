// Modal.js
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop } from '@mui/material';

const CustomBackdrop = (props) => {
  return <Backdrop {...props} onClick={(event) => event.stopPropagation()} />;
};

const Modal = ({ isOpen, onSave, onClose, children, isFormValid, resetForm, title, btnLabel }) => {
  const [localFormValid, setLocalFormValid] = useState(isFormValid);

  useEffect(() => {
    setLocalFormValid(isFormValid);
  }, [isFormValid]);

  const handleSave = () => {
    if (localFormValid) {
      onSave();
      handleClose();
    }
  };

  const handleClose = () => {
    resetForm();  // Reset form fields
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      scroll="body"
      slots={{
        backdrop: CustomBackdrop,
      }}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            borderRadius: '16px',
          },
        },
      }}
    >
      <DialogTitle className='fw-bold'>{title}</DialogTitle>
      <DialogContent sx={{pb:'0'}}>
        {children}
      </DialogContent>
      <DialogActions className='p-4'>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: '8px',
            fontWeight: '700',
            color: '#1C252E',
            borderColor: 'rgba(145, 158, 171, 0.35)',
            '&:hover': {
              bgcolor: 'rgba(145, 158, 171, 0.08)',
              borderColor: 'rgba(145, 158, 171, 0.35)',
            },
          }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!localFormValid}
          sx={{
            bgcolor: '#1C252E',
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: '8px',
            fontWeight: '700',
            '&:hover': { bgcolor: '#454F5B' },
          }}
        >
          {btnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
