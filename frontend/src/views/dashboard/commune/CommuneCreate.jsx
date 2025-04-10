import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';

const CommuneCreate = ({ isOpen, onSave, onClose }) => {
  const [commune, setCommune] = useState({ nom: '' });
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  // Regex autorise : lettres, chiffres, chiffres romains, espaces, tirets
  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid = commune.nom.trim() !== '' && isValidName(commune.nom.trim()) && !inputDisabled;

  const resetForm = () => {
    setCommune({ nom: '' });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Bloque la saisie dès qu’un caractère invalide est détecté
    if (!isValidName(value)) {
      setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
      setInputDisabled(true);
      return; 
    }

    setError('');
    setInputDisabled(false);
    setCommune(prev => ({ ...prev, [name]: value }));
  };

  // Enregistrement
  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
        return;
      }

      setSubmitError('');
      await onSave(commune);
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
