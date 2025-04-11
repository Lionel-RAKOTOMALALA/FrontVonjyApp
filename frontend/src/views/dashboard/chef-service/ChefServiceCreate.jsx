import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';

const ChefServiceCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [chefService, setchefService] = useState({
    nom: '',
    prenom: '',
    contact: '',
    adresse: '',
    sexe: ''
  });

  const isFormValid = 
  chefService.nom !== '' &&
  chefService.prenom !== '' &&
  chefService.contact !== '' &&
  chefService.adresse !== '' &&
  chefService.sexe !== '' &&
  chefService.service !== '';

  const resetForm = () => {
    setchefService({
      nom: '',
      prenom: '', 
      contact: '',
      adresse: '',
      sexe: '',
      service: ''
    });
  }; 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setchefService(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const genre = ['Homme', 'Femme'];
  const services = ['RH', 'Informatique', 'Logistique', 'Comptabilité'];

  const handleSexeChange = (event) => {
    const { value } = event.target;
    setchefService(prevState => ({
      ...prevState,
      sexe: value,
    }));
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    setchefService(prevState => ({
      ...prevState,
      service: value,
    }));
  };

  const showSnackbar = (severity, message, anchorOrigin) => {
    setSnackConfig({ severity, message, anchorOrigin });
    setOpen(true);
  };

  const handleSave = () => {
    onSave(chefService);
    console.log('Données du Chef Service:', chefService);
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
        <div className="row">
          <div className="col mb-3 mt-2">
            <SelectField
              label="Service"
              name="service"
              value={chefService.service}
              onChange={handleServiceChange}
              options={services}
            />
          </div>
        </div>
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom"
            name="nom"
            value={chefService.nom}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <div className="col mb-3 mt-2">
            <InputField
              required
              label="Prénom"
              name="prenom"
              value={chefService.prenom}
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
              value={chefService.contact}
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
              value={chefService.adresse}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3 mt-2">
            <SelectField
              label="Sexe"
              name="sexe"
              value={chefService.sexe}
              onChange={handleSexeChange}
              options={genre}
            />
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default ChefServiceCreate;