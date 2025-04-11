import React, { useState, useEffect } from 'react';  
import Modal from '../../../components/ui/Modal'; 
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';

const ChefServiceCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [chauffeur, setChauffeur] = useState({
    nom: '',
    prenom: '', 
    contact: '',
    adresse: '',
    sexe: ''
  });
   
  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid = chauffeur.nom !== '' && chauffeur.prenom !== '' && chauffeur.sexe.length > 0 && chauffeur.contact !== ''  && chauffeur.adresse !== '';

 
  // Réinitialise tous les champs du formulaire après soumission
  const resetForm = () => {
    setChauffeur({
      nom: '',
      prenom: '', 
      contact: '',
      adresse: '',
      sexe: ''

    });
  }; 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const permisOptions = ['Homme', 'Femme'];
  const handlePermisChange = (event) => {
    const { value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      sexe: value,
    }));
  };

  const showSnackbar = (severity, message, anchorOrigin) => {
    setSnackConfig({ severity, message, anchorOrigin });
    setOpen(true);
  };
  
  const handleSave = () => {
    onSave(chauffeur);    
    console.log('Données du Chef Service:', chauffeur);
  }

  return (
    <Modal
      title="Créer un chef service"
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
        <div className="row">
          <div className="col mb-3 mt-2">
            <InputField
              required
              label="Prénom"
              name="prenom" 
              value={chauffeur.prenom} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3 mt-2">
          <InputField
            required
            label="Numéro de téléphone"
            name="contact"
            value={chauffeur.contact}
            onChange={handleChange}
            type="number"
            inputProps={{ min: 0 }}
          />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3 mt-2">
            <InputField
              required
              label="Adresse"
              name="adresse" 
              value={chauffeur.adresse} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3 mt-2">
          <SelectField
            label="Sexe"
            name="sexe"
            value={chauffeur.sexe}
            onChange={handlePermisChange}
            options={permisOptions} 
          />  
          </div>
        </div>
        
      </div>
    </Modal>
  );
};

export default ChefServiceCreate;