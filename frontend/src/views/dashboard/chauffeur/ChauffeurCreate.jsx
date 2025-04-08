// ChauffeurCreate.js
import React, { useState, useEffect } from 'react';  
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField'; 
import 'dayjs/locale/fr';
import DateField from '../../../components/ui/form/DateField';

import InputQuantity from '../../../components/ui/InputQuantity';  

const ChauffeurCreate = ({ isOpen, onSave, onClose }) => {
  const [chauffeur, setChauffeur] = useState({
    nom: '',
    prenom: '',
    permis_conduire: '',
    experience: 1,
    telephone: '',
  });
  
  const permisOptions = ['B', 'C', 'D', 'E'];
  const isFormValid = chauffeur.nom !== '' && chauffeur.prenom !== '' && chauffeur.permis_conduire.length > 0 && chauffeur.telephone !== '';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePermisChange = (event) => {
    const { value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      permis_conduire: value,
    }));
  };
  

  const handleSave = () => { 
    console.log('Données du chauffeur:', chauffeur); 
  };

  const resetForm = () => {
    setChauffeur({
      nom: '',
      prenom: '',
      permis_conduire: '',
      experience: 1,
      telephone: '',
    });
  };

  const handleDateChange = (newDate) => {

  };

  const handleQuantityChange = (event, newValue) => {
 
  };
  
  return (
    <Modal
      title="Créer un chauffeur"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm} 
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom"
            name="nom" 
            value={chauffeur.nom}
            onChange={handleChange} 
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-0">
          <InputField
            required
            label="Prénom"
            name="prenom" 
            value={chauffeur.prenom}
            onChange={handleChange} 
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col mb-3">
          <InputField
            required
            label="Numéro de téléphone"
            name="telephone"
            value={chauffeur.telephone}
            onChange={handleChange}
            type="number"
            inputProps={{ min: 0 }}
          />
        </div>
      </div>
      <div className="row g-2 mt-3"> 
        <div className="col mb-3">
          <SelectField
            label="Permis de conduire"
            name="permis_conduire"
            value={chauffeur.permis_conduire}
            onChange={handlePermisChange}
            options={permisOptions} 
          />  
        </div>
      </div>
      <div className="row mt-3"> 
        <div className="col mb-3">
          <DateField
            label="Champ date" 
            onChange={handleDateChange}
            required
          /> 
        </div>
      </div>
      <div className="col mb-1 m-0 d-flex flex-column align-items-center">
          <label htmlFor="quantité" className="mb-2" style={{ fontWeight: '700', color: '#919EAB', fontSize: '0.75rem' }}>
            Champ nombre
          </label>
          <InputQuantity 
            aria-label="Nombre"
            min={1}
            max={1000} 
            onChange={handleQuantityChange} 
          />
        </div> 
    </Modal>
  );
};

export default ChauffeurCreate;
