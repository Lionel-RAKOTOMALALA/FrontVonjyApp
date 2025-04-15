import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import RadioGroupField from "../../../components/ui/form/RadioGroupField";
import useResponsableStore from '../../../store/responsableStore'; // Import du store des responsables

const ResponsableEdit = ({ isOpen, responsable, onChange, onSave, onClose }) => {
  const { updateResponsable } = useResponsableStore(); // Utilisation de la méthode updateResponsable du store
  const [fokotanys, setFokotanys] = useState([]);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const validResponsable = responsable || {
    fokotany_id: '',
    classe_responsable: '',
    nom_responsable: '',
    prenom_responsable: '',
    fonction: '',
    formation_acquise: 'true',
  };

  useEffect(() => {
    // Charger les fokotanys depuis l'API
    const fetchFokotanys = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/fokotany/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des fokotanys.');
        }
        const data = await response.json();
        setFokotanys(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des fokotanys :', err);
        setError('Impossible de charger les fokotanys.');
      } finally {
        setLoading(false);
      }
    };

    fetchFokotanys();
  }, []);

  const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9\s-]*$/i.test(value);

  const isFormValid =
    validResponsable.nom_responsable?.trim() !== '' &&
    validResponsable.prenom_responsable?.trim() !== '' &&
    validResponsable.classe_responsable?.trim() !== '' &&
    validResponsable.fonction?.trim() !== '' &&
    validResponsable.fokotany_id?.trim() !== '' &&
    isValidName(validResponsable.nom_responsable?.trim()) &&
    !inputDisabled;

  const resetForm = () => {
    onChange({
      fokotany_id: '',
      classe_responsable: '',
      nom_responsable: '',
      prenom_responsable: '',
      fonction: '',
      formation_acquise: 'true',
    });
    setError('');
    setSubmitError('');
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nom_responsable' && !isValidName(value)) {
      setError("Seules les lettres, chiffres, espaces et tirets sont autorisés.");
      setInputDisabled(true);
      return;
    }

    setError('');
    setInputDisabled(false);
    onChange({ ...validResponsable, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
        return;
      }

      setSubmitError('');

      // Transforme les données pour satisfaire les attentes de l'API
      const payload = {
        id: validResponsable.id,
        fokotany_id: validResponsable.fokotany?.id || validResponsable.fokotany_id,
        classe_responsable: validResponsable.classe_responsable,
        nom_responsable: validResponsable.nom_responsable,
        prenom_responsable: validResponsable.prenom_responsable,
        fonction: validResponsable.fonction,
        formation_acquise: validResponsable.formation_acquise === 'true',
      };

      console.log('Données envoyées pour la mise à jour :', payload); // Debug

      // Appel au store pour mettre à jour le responsable
      await updateResponsable(validResponsable.id, payload);
      if (onSave) onSave('Responsable modifié avec succès !');

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du responsable :", err); // Debug
      setSubmitError(err.message || "Une erreur est survenue lors de la modification. Veuillez réessayer.");
    }
  };

  return (
    <Modal
      title="Modifier un responsable"
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
          <label htmlFor="fokotany_id" className="form-label">Fokotany</label>
          {loading ? (
            <p>Chargement des fokotanys...</p>
          ) : fokotanys.length > 0 ? (
            <SelectField
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={validResponsable.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: fokotany.nomFokotany,
              }))}
              placeholder="Choisissez un fokotany"
            />
          ) : (
            <p className="text-danger">Aucun fokotany disponible.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Classe Responsable"
            name="classe_responsable"
            value={validResponsable.classe_responsable || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du Responsable"
            name="nom_responsable"
            value={validResponsable.nom_responsable || ''}
            onChange={handleChange}
            error={!!error}
            helperText={error || ' '}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Prénom du Responsable"
            name="prenom_responsable"
            value={validResponsable.prenom_responsable || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Fonction"
            name="fonction"
            value={validResponsable.fonction || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formation_acquise"
            value={validResponsable.formation_acquise}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'Oui' },
              { value: 'false', label: 'Non' },
            ]}
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

export default ResponsableEdit;