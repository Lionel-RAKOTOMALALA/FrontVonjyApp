import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useFokotanyStore from '../../../store/fokotanyStore'; // Import du store des fokotanys

const FokotanyEdit = ({ isOpen, fokotany, onChange, onSave, onClose }) => {
  const { updateFokotany } = useFokotanyStore(); // Utilisation de la méthode updateFokotany du store
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const validFokotany = fokotany || { commune_id: '', nomFokotany: '' };

  useEffect(() => {
    // Charger les communes depuis l'API
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
    validFokotany.nomFokotany?.trim() !== '' &&
    validFokotany.commune_id?.trim() !== '' &&
    isValidName(validFokotany.nomFokotany?.trim()) &&
    !inputDisabled;

  const resetForm = () => {
    onChange({ commune_id: '', nomFokotany: '' });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nomFokotany' && !isValidName(value)) {
      setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
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
        setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
        return;
      }
  
      setSubmitError('');
  
      // Transforme 'commune' en 'commune_id' pour satisfaire les attentes de l'API
      const payload = {
        id: validFokotany.id,
        commune_id: validFokotany.commune?.id || validFokotany.commune_id, // Utilise 'id' si 'commune' est un objet
        nomFokotany: validFokotany.nomFokotany,
      };
  
      console.log('Données envoyées pour la mise à jour :', payload); // Debug
  
      // Appel au store pour mettre à jour le fokotany
      await updateFokotany(validFokotany.id, payload);
      if (onSave) onSave('Fokotany modifié avec succès !');
  
      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du fokotany :", err); // Debug
      setSubmitError(err.message || "Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  };

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
      <div className="row">
        <div className="col mb-3 mt-2">
          <label htmlFor="commune_id" className="form-label">Commune</label>
          {loading ? (
            <p>Chargement des communes...</p>
          ) : communes.length > 0 ? (
            <SelectField
              label="Sélectionnez une commune"
              name="commune_id"
              value={validFokotany.commune_id}
              onChange={handleChange}
              options={communes.map((commune) => ({
                value: commune.id.toString(),
                label: commune.nomCommune,
              }))}
              placeholder="Choisissez une commune"
            />
          ) : (
            <p className="text-danger">Aucune commune disponible.</p>
          )}
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
            helperText={error || ' '}
          />
        </div>
        {submitError && (
          <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
            {submitError}
          </p>
        )}
      </div>    
    </Modal>
  );
};

export default FokotanyEdit;