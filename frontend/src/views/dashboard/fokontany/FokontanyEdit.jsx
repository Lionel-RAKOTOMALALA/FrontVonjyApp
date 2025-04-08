import React, { useState, useEffect } from 'react';

import Modal from '../../../components/ui/Modal';

function FokontanyEdit({ isOpen, chauffeur, onChange, onSave, onClose }) { 
 
  // Fallback si `chauffeur` est null/undefined
  const validChauffeur = chauffeur || {};
 
  // État local pour valider le formulaire
  const [isFormValid, setIsFormValid] = useState(true);
  // Vérifie si tous les champs requis sont remplis correctement
  const checkFormValidity = () => {
    const { nom = '', prenom = '', permis_conduire = [], experience = 1 } = validChauffeur;
    const isValid = nom.trim() !== '' && prenom.trim() !== '' && permis_conduire.length > 0 && experience > 0;
    setIsFormValid(isValid);
  };
  
   // Fonction pour réinitialiser le formulaire
   const resetForm = () => {
     onChange({
       nom: '',
       prenom: '', 
     });
   };
  
  
  // Chaque fois que le `chauffeur` change, on vérifie la validité du formulaire
  useEffect(() => {
    checkFormValidity();
  }, [validChauffeur]);
  
  return (
    <Modal
      title="Modifier un commune"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={() => onSave(validChauffeur)}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
    >
 
    </Modal>
  );
}

export default FokontanyEdit;