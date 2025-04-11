import React, { useState, useEffect } from 'react';

import ModaleUpdate from '../../../components/ui/ModaleUpdate';
function ServiceEdit({ isOpen, chauffeur, onChange, onSave, onClose }) { 
 
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    offre: '',
    nombreMembre: ''
  });
 
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    if (chauffeur) {
      setFormData(chauffeur);
    }
  }, [chauffeur]);

  const checkFormValidity = () => {
    const { nom = '', description = '', offre = '', nombreMembre = '' } = formData;
    const isValid = nom.trim() !== '' && description.trim() !== '' && offre.trim() !== '' && nombreMembre !== '';
    setIsFormValid(isValid);
  };
  
  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      offre: '',
      nombreMembre: ''
    });
  };
  
  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <ModaleUpdate
      title="Modifier une service"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={() => onSave(formData)}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
      initialData={chauffeur}
    >
    </ModaleUpdate>
  );
}

export default ServiceEdit;