import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import useCommuneStore from '../../../store/communeStore';

const CommuneEdit = ({ isOpen, commune: initialCommune, onClose, onSuccess }) => {
  const [commune, setCommune] = useState(initialCommune || { nomCommune: '' });
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const { updateCommune } = useCommuneStore();

  console.log(commune);
  

  // Regex : lettres, chiffres, chiffres romains, espaces, tirets
  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid = commune.nomCommune?.trim() !== '' && 
                     isValidName(commune.nomCommune?.trim()) && 
                     !inputDisabled;

  const resetForm = () => {
    setCommune(initialCommune || { nomCommune: '' });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (!isValidName(value)) {
      setError("Caractères non autorisés détectés");
      setInputDisabled(true);
      return;
    }

    setError('');
    setInputDisabled(false);
    setCommune(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError('');
      
      await updateCommune(commune.id, commune);
      
      if (onSuccess) onSuccess('Commune modifiée avec succès !');
      
      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      setSubmitError(err.message || "Erreur lors de la modification");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la modification", 'error');
    }
  };

  return (
    <Modal
      title="Modifier la commune"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={() => {
        resetForm();
        onClose();
      }}
      isFormValid={isFormValid}
      resetForm={resetForm}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom"
            name="nomCommune"
            value={commune.nomCommune || ''}
            onChange={handleChange}
            error={!!error}
            helperText={error || ' '}
          />
          {submitError && (
            <p className="text-danger mt-2 text-sm">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommuneEdit;