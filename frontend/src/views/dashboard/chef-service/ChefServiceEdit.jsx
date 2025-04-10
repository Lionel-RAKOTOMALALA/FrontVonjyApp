import React, { useState, useEffect } from 'react';

import Modal from '../../../components/ui/Modal';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import SelectField from '../../../components/ui/form/SelectField';

function ChefServiceEdit({ isOpen, chauffeur, onChange, onSave, onClose }) { 
  
  const permisOptions = ['Homme', 'Femme'];

  // Fallback si `chauffeur` est null/undefined
  const validChauffeur = chauffeur || {};

  const { nom = '', prenom = '', contact = 1, adresse = '', sexe = []  } = validChauffeur;
 
  // État local pour valider le formulaire
  const [isFormValid, setIsFormValid] = useState(true);

  // Vérifie si tous les champs requis sont remplis correctement
  const checkFormValidity = () => {
    const { nom = '', prenom = '', contact = 1 , adresse = '',  sexe = [] } = validChauffeur;
    const isValid = nom.trim() !== '' && prenom.trim() !== '' && contact.toString().trim() !== '' && adresse.trim() !== '' && sexe.trim() !== '';
    setIsFormValid(isValid);
  };

 
  
   // Fonction pour réinitialiser le formulaire
   const resetForm = () => {
     onChange({
       nom: '',
       prenom: '', 
     });
   };
  
  
  // Chaque fois que le `chauffeur` change, on vérifie la validité du formulaire
  useEffect(() => {
    checkFormValidity();
  }, [validChauffeur]);

  const handleSave = () => {
    onSave(chauffeur);    
    console.log('Données modifier du Chef Service:', chauffeur);
  }
  
  return (
    <Modal
      title="Modifier chef service"
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
              <div className="col mb-3 mt-2"> 
                <TextField
                  label="Prénom" 
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
            <div className="row">
              <div className="col mb-3 mt-2"> 
                <TextField
                  label="Contact" 
                  fullWidth
                  type="number"
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
                  value={contact}
                  onChange={(e) => onChange({ ...validChauffeur, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col mb-3 mt-2"> 
                <TextField
                  label="Adresse" 
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
                  value={adresse}
                  onChange={(e) => onChange({ ...validChauffeur, adresse: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col mb-3 mt-2"> 
                <SelectField
                  label="Sexe" 
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
                  options={permisOptions}
                  value={sexe}
                  onChange={(e) => onChange({ ...validChauffeur, sexe: e.target.value })}
                />
              </div>
            </div>
           
            

 
    </Modal>
  );
}

export default ChefServiceEdit;