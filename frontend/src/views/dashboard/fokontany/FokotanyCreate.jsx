import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useFokotanyStore from '../../../store/fokotanyStore'; // Importer le store des fokotanys

const FokotanyCreate = ({ isOpen, onClose, onSuccess }) => {
  const [fokotany, setFokotany] = useState({ commune_id: '', nomFokotany: '' });
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createFokotany } = useFokotanyStore(); // Utiliser l'action `createFokotany` du store
  const communeOptions = communes.map((commune) => `${commune.id}-${commune.nomCommune}`);


  // Charger les communes depuis l'API
  useEffect(() => {
    const fetchCommunes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/communes/', {
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
        console.error('Erreur lors de la récupération des communes :', err);
        setError('Impossible de charger les communes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunes();
  }, []);

  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid =
    fokotany.nomFokotany.trim() !== '' &&
    fokotany.commune_id !== '' &&
    isValidName(fokotany.nomFokotany.trim()) &&
    !inputDisabled;

  const resetForm = () => {
    setFokotany({ commune_id: '', nomFokotany: '' });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Valider le champ nomFokotany
    if (name === 'nomFokotany' && !isValidName(value)) {
      setError("Caractères non autorisés détectés");
      setInputDisabled(true);
      return;
    }

    setError('');
    setInputDisabled(false);
    setFokotany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError('');

      // Appel au store pour créer un fokotany
      await createFokotany(fokotany);
      if (onSuccess) onSuccess('Fokotany créé avec succès !');

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du fokotany :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la création.");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la création.", 'error');
    }
  };

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
              label: commune.nomCommune, // ou autre champ pour le nom
              value: commune.id.toString(), // assure que value est une string
            }))}
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
            error={!!error}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FokotanyCreate;