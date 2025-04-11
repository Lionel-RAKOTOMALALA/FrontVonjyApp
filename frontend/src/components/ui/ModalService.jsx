// Modal.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop, TextField } from '@mui/material';
import { Fade, Grow } from '@mui/material';
import SelectField from "./form/SelectField";

const CustomBackdrop = (props) => {
  return <Backdrop {...props} onClick={(event) => event.stopPropagation()} />;
};

const ModalService = ({ isOpen, onSave, onClose, children, isFormValid, resetForm, title, btnLabel }) => {
  const [localFormValid, setLocalFormValid] = useState(isFormValid);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    offre: '',
    nombreMembre: '',
    fokontany: ''
  });

  useEffect(() => {
    const isValid = formData.nom !== '' && formData.description !== '' && formData.offre !== '' && formData.nombreMembre !== '' && formData.fokontany !== '';
    setLocalFormValid(isValid);
  }, [formData]);
  
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (localFormValid) {
      onSave(formData);
      handleClose();
      console.log(formData);
    }
  };

  const handleClose = () => {
    resetForm();
    setFormData({
      nom: '',
      description: '',
      offre: '',
      nombreMembre: ''
    });
    onClose();
  };

  const textFieldStyle = {
    '& fieldset': {
      borderColor: 'rgba(145 158 171 / 0.2)',
    },
    '& .MuiFormLabel-root': {
      color: '#919EAB !important',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': {
        borderColor: '#1C252E',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1C252E',
      },
      '&.Mui-error fieldset': {
        borderColor: '#f44336',
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 'inherit',
      color: '#637381',
      '&.Mui-focused': {
        fontWeight: 'bold',
        color: '#1C252E !important',
      },
      '&.Mui-error': {
        color: '#f44336 !important',
      },
    }
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
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 500
      }}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)'
          },
        },
      }}
    >
      <Grow in={isOpen} timeout={600}>
        <div>
          <DialogTitle className='fw-bold' sx={{ pb: 3, pt: 3 }}>{title}</DialogTitle>
          <DialogContent sx={{ pb: '0', px: 3 }} style={{paddingTop:'12px'}}>
            <SelectField
              label="Fokontany"
              name="fokontany"
              value={formData.fokontany}
              onChange={handleChange}
              options={["Ankadifotsy", "Isoraka", "Analakely"]} 
            /> 
            <TextField
              fullWidth
              margin="normal"
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Offre"
              name="offre"
              value={formData.offre}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nombre de membres"
              name="nombreMembre"
              type="number"
              value={formData.nombreMembre}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            {children}
          </DialogContent>
          <DialogActions className='p-4'>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '12px',
                fontWeight: '700',
                color: '#1C252E',
                borderColor: 'rgba(145, 158, 171, 0.35)',
                padding: '8px 22px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(145, 158, 171, 0.08)',
                  borderColor: 'rgba(145, 158, 171, 0.35)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)'
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
                borderRadius: '12px',
                fontWeight: '700',
                padding: '8px 22px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 16px 0 rgba(28,37,46,0.2)',
                '&:hover': { 
                  bgcolor: '#454F5B',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 20px 0 rgba(28,37,46,0.3)'
                },
              }}
            >
              {btnLabel}
            </Button>
          </DialogActions>
        </div>
      </Grow>
    </Dialog>
  );
};

export default ModalService;