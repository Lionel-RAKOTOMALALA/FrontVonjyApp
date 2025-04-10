import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';

function CommuneEdit({ isOpen, commune, onChange, onSave, onClose }) {
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const validCommune = commune || {};

  // Regex : lettres, chiffres, chiffres romains, espaces, tirets
  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid = validCommune.nom?.trim() !== '' && isValidName(validCommune.nom?.trim()) && !inputDisabled;

  const resetForm = () => {
    onChange({ nom: '' });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Stoppe la saisie si caractère invalide
    if (!isValidName(value)) {
      setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
      setInputDisabled(true);
      return;
    }

    setError('');
    setInputDisabled(false);
    onChange({ ...validCommune, [name]: value });
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!isFormValid) {
      setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
      return;
    }

    try {
      setSubmitError('');
      await onSave(validCommune);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du commune :", err);
      setSubmitError("Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  };

  return (
    <Modal
      title="Modifier un commune"
      btnLabel="Sauvegarder"
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
            value={validCommune.nom || ''}
            onChange={handleInputChange}
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
}

export default CommuneEdit;
