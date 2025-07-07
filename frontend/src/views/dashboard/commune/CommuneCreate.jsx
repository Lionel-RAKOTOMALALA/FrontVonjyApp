import { useState } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import useCommuneStore from '../../../store/communeStore';

const communeSchema = z.object({
  nomCommune: z.string().trim().min(1, "Le nom est requis"),
});

const CommuneCreate = ({ isOpen, onClose, onSuccess }) => {
  const [commune, setCommune] = useState({ nomCommune: '' });
  const [error, setError] = useState('');
  const { createCommune } = useCommuneStore();

  const isFormValid = communeSchema.safeParse(commune).success;

  const resetForm = () => {
    setCommune({ nomCommune: '' });
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCommune(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const result = communeSchema.safeParse(commune);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    try {
      await createCommune(commune);
      if (onSuccess) onSuccess('Commune créée avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Erreur lors de la création");
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
      <div className="row ">
        <div className="col mb-0 mt-2">
          <InputField
            required
            label="Nom"
            name="nomCommune"
            value={commune.nomCommune}
            onChange={handleChange}
            error={!!error}
            helperText={error}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CommuneCreate;