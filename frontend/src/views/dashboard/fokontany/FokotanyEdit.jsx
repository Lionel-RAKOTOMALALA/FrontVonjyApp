import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useFokotanyStore from '../../../store/fokotanyStore';

// Schéma zod pour le fokotany (identique à FokotanyCreate)
const fokotanySchema = z.object({
  commune_id: z.string().min(1, "La commune est requise"),
  nomFokotany: z.string().min(1, "Le nom est requis"),
});

const FokotanyEdit = ({ isOpen, fokotany, onChange, onSave, onClose }) => {
  const { updateFokotany } = useFokotanyStore();
  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Préparation des données du fokotany avec une valeur par défaut pour commune_id
  const validFokotany = fokotany || {
    commune_id: '',
    nomFokotany: ''
  };

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

        // Initialiser commune_id si on a un fokotany
        if (!initialized && fokotany && fokotany.commune && fokotany.commune.id) {
          onChange({
            ...fokotany,
            commune_id: fokotany.commune.id.toString()
          });
          setInitialized(true);
        }
      } catch (err) {
        setSubmitError('Impossible de charger les communes.');
      }
    };

    fetchCommunes();
    // eslint-disable-next-line
  }, [fokotany, onChange, initialized]);

  // Validation d'un champ individuel
  const validateField = (name, value) => {
    try {
      fokotanySchema.pick({ [name]: true }).parse({ [name]: value });
      return '';
    } catch (err) {
      return err.errors?.[0]?.message || '';
    }
  };

  // Gestion du changement de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...validFokotany, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError('');
  };

  // Validation globale du formulaire
  const isFormValid = fokotanySchema.safeParse(validFokotany).success;

  // Sauvegarde
  const handleSave = async () => {
    try {
      fokotanySchema.parse(validFokotany);
      const payload = {
        id: validFokotany.id,
        commune_id: validFokotany.commune_id,
        nomFokotany: validFokotany.nomFokotany
      };
      await updateFokotany(validFokotany.id, payload);
      if (onSave) onSave('Fokotany modifié avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      if (err.errors) {
        // Erreurs zod
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message || "Une erreur est survenue lors de la modification.");
        if (onSave) onSave(err.message || "Erreur lors de la modification.", 'error');
      }
    }
  };

  const resetForm = () => {
    onChange({
      commune_id: '',
      nomFokotany: ''
    });
    setErrors({});
    setSubmitError('');
    setInitialized(false);
  };

  // S'assurer que la valeur par défaut est '' si undefined ou non disponible
  const selectedCommuneId = validFokotany.commune_id || '';
  const communeExists = communes.some(commune => commune.id.toString() === selectedCommuneId);
  const safeCommune = communeExists ? selectedCommuneId : '';

  return (
    <Modal
      title="Modifier un fokotany"
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
      <div className="row mt-2">
        <div className="col mb-4">
          <SelectField
            label="Commune"
            name="commune_id"
            value={safeCommune}
            onChange={handleChange}
            options={communes.map((commune) => ({
              label: commune.nomCommune,
              value: commune.id.toString(),
            }))}
            error={!!errors.commune_id}
            helperText={errors.commune_id}
            placeholder="Choisissez une commune"
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du fokotany"
            name="nomFokotany"
            value={validFokotany.nomFokotany || ''}
            onChange={handleChange}
            error={!!errors.nomFokotany}
            helperText={errors.nomFokotany}
          />
        </div>
      </div>
      {submitError && (
        <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
          {submitError}
        </p>
      )}
    </Modal>
  );
};

export default FokotanyEdit;