import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { TextField } from '@mui/material';

function CommuneEdit({ isOpen, commune, onChange, onSave, onClose }) {
  const validCommune = commune || {};
  const [isFormValid, setIsFormValid] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Regex : lettres, accents, chiffres, chiffres romains, espaces et tirets
  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const checkFormValidity = () => {
    const { nom = '' } = validCommune;
    const trimmedNom = nom.trim();

    if (trimmedNom === '') {
      setError('Le nom est requis.');
      setIsFormValid(false);
    } else if (!isValidName(trimmedNom)) {
      setError('Seules les lettres, chiffres, chiffres romains, espaces et tirets sont autorisés.');
      setIsFormValid(false);
    } else {
      setError('');
      setIsFormValid(true);
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [validCommune]);

  const resetForm = () => {
    onChange({ nom: '' });
    setError('');
    setSubmitError('');
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    onChange({ ...validCommune, nom: value });
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Le formulaire contient des erreurs.");
        return;
      }

      setSubmitError('');
      await onSave(validCommune); // attend que onSave s'exécute (si async)
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      setSubmitError("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  const { nom = '' } = validCommune;

  return (
    <Modal
      title="Modifier un commune"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <TextField
            label="Nom"
            fullWidth
            required
            error={!!error}
            helperText={error || ' '}
            value={nom}
            onChange={handleInputChange}
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
                color: '#637381',
                '&.Mui-focused': {
                  fontWeight: 'bold',
                  color: '#1C252E',
                },
              },
            }}
          />
          {submitError && (
            <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
              {submitError}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default CommuneEdit;
