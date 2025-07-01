import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import useCommuneStore from '../../../store/communeStore';

const communeSchema = z.object({
  nomCommune: z.string().trim().min(1, "Le nom est requis"),
});

const CommuneEdit = ({ isOpen, commune: initialCommune, onClose, onSuccess }) => {
  const [commune, setCommune] = useState(initialCommune || { nomCommune: '' });
  const [error, setError] = useState('');
  const { updateCommune } = useCommuneStore();

  // Synchronise l'état local avec la commune sélectionnée
  useEffect(() => {
    setCommune(initialCommune || { nomCommune: '' });
    setError('');
  }, [initialCommune, isOpen]);

  const isFormValid = communeSchema.safeParse(commune).success;

  const resetForm = () => {
    setCommune(initialCommune || { nomCommune: '' });
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCommune(prev => ({ ...prev, [name]: value }));
    // Ne pas reset l'erreur ici pour garder l'affichage si besoin
  };

  const handleSave = async () => {
    const result = communeSchema.safeParse(commune);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    try {
      await updateCommune(commune.id, commune);
      if (onSuccess) onSuccess('Commune modifiée avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Erreur lors de la modification");
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
        <div className="col mb-2 mt-2">
          <InputField
            required
            label="Nom"
            name="nomCommune"
            value={commune.nomCommune || ''}
            onChange={handleChange}
            error={!!error}
            helperText={error}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CommuneEdit;