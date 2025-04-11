import React, { useState, useEffect } from 'react';  
import ModalService from '../../../components/ui/ModalService'; 

const ServiceCreate = ({ isOpen, onSave, onClose }) => {
  const [localFormValid, setLocalFormValid] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    offre: '',
    nombreMembre: ''
  });

  useEffect(() => {
    const isValid = formData.nom !== '' && formData.description !== '' && formData.offre !== '' && formData.nombreMembre !== '';
    setLocalFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      offre: '',
      nombreMembre: ''
    });
  };

  const handleSave = () => {
    if (localFormValid) {
      console.log(formData);
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalService
      title="Créer une service"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={localFormValid}
      resetForm={resetForm} 
      maxWidth="435px"
    >
    
    </ModalService>
  );
};

export default ServiceCreate;