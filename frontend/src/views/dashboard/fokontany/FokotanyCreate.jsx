import { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useFokotanyStore from '../../../store/fokotanyStore';

// Schéma zod pour le fokotany
const fokotanySchema = z.object({
  commune_id: z.string().trim().min(1, "La commune est requise"),
  nomFokotany: z.string().trim().min(1, "Le nom est requis"),
});

const FokotanyCreate = ({ isOpen, onClose, onSuccess }) => {
  const [fokotany, setFokotany] = useState({ commune_id: '', nomFokotany: '' });
  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { createFokotany } = useFokotanyStore();

  // Charger les communes depuis l'API
  useEffect(() => {
    const fetchCommunes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/communes/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des communes.');
        }
        const data = await response.json();
        setCommunes(data);
      } catch (err) {
        setErrors('Impossible de charger les communes.');
      }
    };

    fetchCommunes();
  }, []);

  const validateField = (name, value) => {
    try {
      fokotanySchema.pick({ [name]: true }).parse({ [name]: value });
      return '';
    } catch (err) {
      return err.errors?.[0]?.message || '';
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFokotany((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError('');
  };

  const handleSave = async () => {
    try {
      fokotanySchema.parse(fokotany);
      await createFokotany(fokotany);
      if (onSuccess) onSuccess('Fokotany créé avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      if (err.errors) {
        // Zod errors
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message || "Une erreur est survenue lors de la création.");
        if (onSuccess) onSuccess(err.message || "Erreur lors de la création.", 'error');
      }
    }
  };

  const resetForm = () => {
    setFokotany({ commune_id: '', nomFokotany: '' });
    setErrors({});
    setSubmitError('');
  };

  const isFormValid = fokotanySchema.safeParse(fokotany).success;

  return (
    <Modal
      title="Créer un fokotany"
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
      <div className="row mt-2">
        <div className="col mb-4">
          <SelectField
            label="Commune"
            name="commune_id"
            value={fokotany.commune_id}
            onChange={handleChange}
            options={communes.map((commune) => ({
              label: commune.nomCommune,
              value: commune.id.toString(),
            }))}
            error={!!errors.commune_id}
            helperText={errors.commune_id}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du fokotany"
            name="nomFokotany"
            value={fokotany.nomFokotany}
            onChange={handleChange}
            error={!!errors.nomFokotany}
            helperText={errors.nomFokotany}
          />
        </div>
      </div>
      {submitError && (
        <div className="alert alert-danger">{submitError}</div>
      )}
    </Modal>
  );
};

export default FokotanyCreate;