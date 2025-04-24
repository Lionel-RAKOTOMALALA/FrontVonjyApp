import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useFokotanyStore from '../../../store/fokotanyStore';

const FokotanyEdit = ({ isOpen, fokotany, onChange, onSave, onClose }) => {
  const { updateFokotany } = useFokotanyStore();
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Préparation des données du fokotany avec une valeur par défaut pour commune_id
  const validFokotany = fokotany || {
    commune_id: '',
    nomFokotany: ''
  };

  // Charger les communes depuis l'API
  useEffect(() => {
    const fetchCommunes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://www.admin.com/api/communes/', {
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
        
        // Après avoir chargé les communes, initialiser commune_id si on a un fokotany
        if (!initialized && fokotany && fokotany.commune && fokotany.commune.id) {
          onChange({
            ...fokotany,
            commune_id: fokotany.commune.id.toString()
          });
          setInitialized(true);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des communes :', err);
        setError('Impossible de charger les communes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunes();
  }, [fokotany, onChange, initialized]);

  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

  const isFormValid =
    validFokotany.nomFokotany?.trim() !== '' &&
    validFokotany.commune_id && 
    isValidName(validFokotany.nomFokotany?.trim()) &&
    !inputDisabled;

  const resetForm = () => {
    onChange({
      commune_id: '',
      nomFokotany: ''
    });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
    setInitialized(false);
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
    onChange({ ...validFokotany, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError('');

      // Préparation des données pour l'API
      const payload = {
        id: validFokotany.id,
        commune_id: validFokotany.commune_id,
        nomFokotany: validFokotany.nomFokotany
      };

      console.log('Données envoyées pour la mise à jour :', payload);

      // Appel au store pour mettre à jour le fokotany
      await updateFokotany(validFokotany.id, payload);
      if (onSave) onSave('Fokotany modifié avec succès !');

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du fokotany :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la modification.");
      if (onSave) onSave(err.message || "Erreur lors de la modification.", 'error');
    }
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
            error={!!error} 
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