import React, { useState, useEffect } from 'react';  
import Modal from '../../../components/ui/Modal'; 

const CommuneCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [chauffeur, setChauffeur] = useState({
    nom: '',
    prenom: '',
    permis_conduire: '',
    experience: 1,
    telephone: '',
  });
   
  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid = chauffeur.nom !== '' && chauffeur.prenom !== '' && chauffeur.permis_conduire.length > 0 && chauffeur.telephone !== '';

 
  // Réinitialise tous les champs du formulaire après soumission
  const resetForm = () => {
    setChauffeur({
      nom: '',
      prenom: '',
      permis_conduire: '',
      experience: 1,
      telephone: '',
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

export default CommuneCreate;