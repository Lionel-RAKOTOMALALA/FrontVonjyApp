import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';

const CommuneCreate = ({ isOpen, onSave, onClose }) => {
  const [commune, setCommune] = useState({ nom: '' });
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Validation : lettres, chiffres, chiffres romains, espaces et tirets
  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  // Validation du formulaire
  const isFormValid = commune.nom.trim() !== '' && isValidName(commune.nom.trim());

  const resetForm = () => {
    setCommune({ nom: '' });
    setError('');
    setSubmitError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (!isValidName(value)) {
      setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
    } else {
      setError('');
      setCommune(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
        return;
      }

      setSubmitError('');
      await onSave(commune); // attendre si onSave est async
      console.log('Données du commune:', commune);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du commune :", err);
      setSubmitError("Une erreur est survenue lors de la création. Veuillez réessayer.");
    }
  };

  return (
    <Modal
      title="Créer un commune"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom"
            name="nom"
            value={commune.nom}
            onChange={handleChange}
            error={!!error}
            helperText={error || ' '}
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
};

export default CommuneCreate;
