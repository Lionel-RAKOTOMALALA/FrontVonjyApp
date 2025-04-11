import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { TextField } from '@mui/material';
import SelectField from '../../../components/ui/form/SelectField';

function ChefServiceEdit({ isOpen, chefService, onChange, onSave, onClose }) {
  const permisOptions = ['Homme', 'Femme'];
  const serviceOptions = ['RH', 'Informatique', 'Logistique', 'Comptabilité'];

  const validChefSevice = chefService || {};

  const {
    nom = '',
    prenom = '',
    contact = 1,
    adresse = '',
    sexe = '',
    service = '',
  } = validChefSevice;

  const [isFormValid, setIsFormValid] = useState(true);

  const checkFormValidity = () => {
    const isValid =
      nom.trim() !== '' &&
      prenom.trim() !== '' &&
      contact.toString().trim() !== '' &&
      adresse.trim() !== '' &&
      sexe.trim() !== '' &&
      service.trim() !== '';
    setIsFormValid(isValid);
  };

  const resetForm = () => {
    onChange({
      nom: '',
      prenom: '',
      contact: '',
      adresse: '',
      sexe: '',
      service: '',
    });
  };

  useEffect(() => {
    checkFormValidity();
  }, [validChefSevice]);

  const handleSave = () => {
    onSave(chefService);
    console.log('Données modifiées du Chef Service:', chefService);
  };

  return (
    <Modal
      title="Modifier chef service"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
    > 
      <div className="row">
        <div className="col mb-3 mt-2">
          <SelectField
            label="Service"
            fullWidth
            options={serviceOptions}
            value={service}
            onChange={(e) => onChange({ ...validChefSevice, service: e.target.value })}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3 mt-2">
          <TextField
            label="Nom"
            fullWidth
            sx={fieldStyle}
            value={nom}
            onChange={(e) => onChange({ ...validChefSevice, nom: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3 mt-2">
          <TextField
            label="Prénom"
            fullWidth
            sx={fieldStyle}
            value={prenom}
            onChange={(e) => onChange({ ...validChefSevice, prenom: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3 mt-2">
          <TextField
            label="Contact"
            type="number"
            fullWidth
            sx={fieldStyle}
            value={contact}
            onChange={(e) => onChange({ ...validChefSevice, contact: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3 mt-2">
          <TextField
            label="Adresse"
            fullWidth
            sx={fieldStyle}
            value={adresse}
            onChange={(e) => onChange({ ...validChefSevice, adresse: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3 mt-2">
          <SelectField
            label="Sexe"
            fullWidth
            options={permisOptions}
            value={sexe}
            onChange={(e) => onChange({ ...validChefSevice, sexe: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}

const fieldStyle = {
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
    color: '#637381',
    '&.Mui-focused': {
      fontWeight: 'bold',
      color: '#1C252E',
    },
  },
};

export default ChefServiceEdit;
