import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import RadioGroupField from "../../../components/ui/form/RadioGroupField";
import useResponsableStore from '../../../store/responsableStore'; // Import du store des responsables

const ResponsableEdit = ({ isOpen, responsable, onChange, onSave, onClose }) => {
  const { updateResponsable } = useResponsableStore(); // Utilisation de la méthode updateResponsable du store
  const [fokotanys, setFokotanys] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loadingFokotanys, setLoadingFokotanys] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  const [localResponsable, setLocalResponsable] = useState({
    fokotany_id: '',
    classe_responsable: '',
    nom_responsable: '',
    prenom_responsable: '',
    contact_responsable: '',
    fonction: '',
    formation_acquise: 'true',
  });

  // Initialize localResponsable state when responsable prop changes
  useEffect(() => {
    if (responsable) {
      setLocalResponsable({
        fokotany_id: responsable.fokotany?.id?.toString() || '',
        classe_responsable: responsable.classe_responsable || '',
        nom_responsable: responsable.nom_responsable || '',
        prenom_responsable: responsable.prenom_responsable || '',
        contact_responsable: responsable.contact_responsable || '',
        fonction: responsable.fonction || '',
        formation_acquise: responsable.formation_acquise ? 'true' : 'false',
      });
    }
  }, [responsable]);

  // Fetch fokotanys
  useEffect(() => {
    const fetchFokotanys = async () => {
      setLoadingFokotanys(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/fokotany/', {
          headers: {
            Authorization: `Bearer ${token}`,
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
        setLoadingFokotanys(false);
      }
    };

    fetchFokotanys();
  }, []);



  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalResponsable((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (
      !localResponsable.nom_responsable || 
      !localResponsable.classe_responsable ||
      !localResponsable.fonction ||
      !localResponsable.fokotany_id 
    ) {
      setSubmitError("Tous les champs sont requis. Veuillez les remplir.");
      return;
    }

    try {
      const payload = {
        ...localResponsable,
        formation_acquise: localResponsable.formation_acquise === 'true',
      };

      console.log('Données envoyées pour la mise à jour :', payload);

      await updateResponsable(responsable.id, payload);
      if (onSave) onSave('Responsable modifié avec succès !');
      onClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du responsable :', err);
      setSubmitError(err.message || 'Une erreur est survenue lors de la modification.');
    }
  };

  return (
    <Modal
      title="Modifier un responsable"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid
      maxWidth="435px"
    >

      <div className="row">
        <div className="col mb-3 mt-2">
          {loadingFokotanys ? (
            <p>Chargement des fokotanys...</p>
          ) : fokotanys.length > 0 ? (
            <SelectField
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={localResponsable.fokotany_id}
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
            value={localResponsable.classe_responsable}
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
            value={localResponsable.nom_responsable}
            onChange={handleChange}
          />
        </div>
        <div className="col mb-3">
          <InputField
            required={false}
            label="Prénom du Responsable"
            name="prenom_responsable"
            value={localResponsable.prenom_responsable}
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
            value={localResponsable.fonction}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required={false}
            label="Contact"
            name="contact_responsable"
            value={localResponsable.contact_responsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formation_acquise"
            value={localResponsable.formation_acquise}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'Oui' },
              { value: 'false', label: 'Non' },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ResponsableEdit;