import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import QuantityInput from '../../../components/ui/QuantityInput';
import Modal from '../../../components/ui/Modal';

function ChauffeurEdit({ isOpen, chauffeur, onChange, onSave, onClose }) {
  const permisOptions = ['B', 'C', 'D', 'E'];
 
  const validChauffeur = chauffeur || {};
 
  const [isFormValid, setIsFormValid] = useState(true);
 
  const resetForm = () => {
    onChange({
      nom: '',
      prenom: '',
      permis_conduire: [],
      experience: 1,
    });
  };
 
  const checkFormValidity = () => {
    const { nom = '', prenom = '', permis_conduire = [], experience = 1 } = validChauffeur;
    const isValid = nom.trim() !== '' && prenom.trim() !== '' && permis_conduire.length > 0 && experience > 0;
    setIsFormValid(isValid);
  };
 
  useEffect(() => {
    checkFormValidity();
  }, [validChauffeur]);
 
  const { nom = '', prenom = '', permis_conduire = [], experience = 1 } = validChauffeur;

  return (
    <Modal
      title="Modifier un chauffeur"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={() => onSave(validChauffeur)}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
    >
      <div className="row">
        <div className="col mb-3 mt-2"> 
          <TextField
            label="Nom" 
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', 
                '&:hover fieldset': {
                  borderColor: '#1C252E',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1C252E',
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 'bold', 
                color:'#637381',
                '&.Mui-focused': {
                  fontWeight: 'bold',                        
                  color: '#1C252E',   
                },
              },
            }}
            value={nom}
            onChange={(e) => onChange({ ...validChauffeur, nom: e.target.value })}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-0"> 
          <TextField
            label="Prénom"
            id="outlined-size-small" 
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', 
                '&:hover fieldset': {
                  borderColor: '#1C252E',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1C252E', 
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 'bold', 
                color:'#637381',
                '&.Mui-focused': {
                  fontWeight: 'bold',                        
                  color: '#1C252E',   
                },
              },
            }}
            value={prenom}
            onChange={(e) => onChange({ ...validChauffeur, prenom: e.target.value })}
          />
        </div> 
      </div>
      <div className="row g-2 mt-3">
        <div className="col mb-0 mt-3">
          <FormControl fullWidth>
            <InputLabel id="permis-label"
              sx={{ 
                fontWeight: 'bold', 
                color:'#637381',
                '&.Mui-focused': {
                  fontWeight: 'bold',                        
                  color: '#1C252E',  
                },
              }}
            >
              Permis de Conduire
            </InputLabel>
            <Select
              label="Permis de conduire"
              labelId="permis-label"
              id="permisBackdrop"
              
              value={permis_conduire}
              onChange={(e) => onChange({ ...validChauffeur, permis_conduire: e.target.value })}
              renderValue={(selected) => selected.join(', ')}
              sx={{
                borderRadius: '8px',  
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1C252E',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1C252E', 
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: 'black',
                    boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px',
                    maxHeight: '240px',
                    borderRadius: '10px',
                    padding: '6px 8px',
                    margin: '6px',
                    color: '#1C252E', 
                    '& .MuiMenuItem-root': {  
                      '&.Mui-selected': {
                        borderRadius: '10px',
                        margin: '4px 0',
                      },
                      '&:hover': {
                        borderRadius: '10px',
                      },
                    },
                  },
                },
              }}
            >
              {permisOptions.map((permis) => (
                <MenuItem key={permis} value={permis}>
                  <Checkbox checked={permis_conduire.indexOf(permis) > -1} />
                  <ListItemText primary={permis} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col mb-1 d-flex flex-column align-items-center">
          <label htmlFor="experienceBackdrop" className="mb-2" style={{fontWeight: '700', color: '#637381', fontSize:'0.75rem'}}>Années d'expérience</label>
          <QuantityInput
            aria-label="Expérience"
            min={1}
            max={99}
            value={experience}
            onChange={(e, value) => onChange({ ...validChauffeur, experience: value })}
          />  
        </div>
      </div> 
    </Modal>
  );
}

export default ChauffeurEdit;
