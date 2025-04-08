import React, { useState, useEffect } from 'react';  
import Modal from '../../../components/ui/Modal'; 

const ServiceCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [chauffeur, setChauffeur] = useState({
    nom: '',
    prenom: '', 
  });
   
  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid = chauffeur.nom !== '' && chauffeur.prenom !== '';

 
  // Réinitialise tous les champs du formulaire après soumission
  const resetForm = () => {
    setChauffeur({
      nom: '',
      prenom: '', 
    });
  }; 
  
  const handleSave = () => {

  }

  return (
    <Modal
      title="Créer un commune"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm} 
      maxWidth="435px"
    >
    
    </Modal>
  );
};

export default ServiceCreate;