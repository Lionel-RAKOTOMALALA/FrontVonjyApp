import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import useCommuneStore from '../../../store/communeStore';

const CommuneCreate = ({ isOpen, onClose,  onSuccess }) => { // 1. Supprimez onSave
  const [commune, setCommune] = useState({ nomCommune: '' });
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const { createCommune } = useCommuneStore();

  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid = commune.nomCommune.trim() !== '' && 
                     isValidName(commune.nomCommune.trim()) && 
                     !inputDisabled;

  const resetForm = () => {
    setCommune({ nomCommune: '' });
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
      
      // 2. Appel unique au store
      await createCommune(commune);
      if (onSuccess) onSuccess('Commune créée avec succès !');
      
      // 3. Fermeture et reset
      resetForm();
      onClose(); // Appel direct sans callback intermédiaire
    } catch (err) {
      console.error("Erreur:", err);
      setSubmitError(err.message || "Erreur lors de la création");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la création", 'error');
    }
  };

  return (
    <Modal
      title="Créer une commune"
      btnLabel="Créer"
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
            value={commune.nomCommune}
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

export default CommuneCreate;